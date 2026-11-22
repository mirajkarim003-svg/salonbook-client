"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// No baseURL needed: it uses the same website address automatically.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
});
