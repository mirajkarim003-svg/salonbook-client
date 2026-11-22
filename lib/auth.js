// Better Auth (SERVER side only). It stores users/sessions in MongoDB.
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins/jwt";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { ObjectId } from "mongodb";
import { getMongoClient } from "./mongodb";

const client = getMongoClient();
const db = client.db(process.env.DB_NAME || "salonbook");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(Boolean),

  database: mongodbAdapter(db, { client, transaction: false }),

  // Our "users" collection (name, email, image, role, isBlocked + phone)
  user: {
    modelName: "users",
    additionalFields: {
      // input:false -> a visitor can NEVER send these values from the sign-up form
      role: { type: "string", required: false, defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      phone: { type: "string", required: false, defaultValue: "", input: false },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  // Password rule: at least one uppercase + one lowercase letter
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must have at least one uppercase and one lowercase letter.",
          });
        }
      }
    }),
  },

  // Blocked users cannot start a new session (login)
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
            if (user?.isBlocked) {
              throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Contact the salon." });
            }
          } catch (err) {
            if (err instanceof APIError) throw err;
          }
          return { data: session };
        },
      },
    },
  },

  // JWT plugin: gives the browser a signed token that the Express server can verify
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        definePayload: ({ user }) => ({ email: user.email, name: user.name }),
      },
    }),
  ],
});
