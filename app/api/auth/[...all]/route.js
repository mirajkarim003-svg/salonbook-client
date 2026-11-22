import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// All Better Auth endpoints live under /api/auth/*
export const { GET, POST } = toNextJsHandler(auth);
