"use client";
import { authClient } from "./auth-client";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

// We keep the JWT in memory so we do not ask for a new one on every request.
let cached = { token: null, expiresAt: 0 };

export function clearTokenCache() {
  cached = { token: null, expiresAt: 0 };
}

async function getToken() {
  if (cached.token && cached.expiresAt - 60_000 > Date.now()) return cached.token;
  const { data, error } = await authClient.token();
  if (error || !data?.token) return null;
  let expiresAt = Date.now() + 10 * 60_000;
  try {
    const payload = JSON.parse(atob(data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp) expiresAt = payload.exp * 1000;
  } catch {}
  cached = { token: data.token, expiresAt };
  return cached.token;
}

// apiFetch("/services")  or  apiFetch("/appointments", { method: "POST", body: {...} })
// Sends the JWT automatically and throws an Error(message) when something fails.
export async function apiFetch(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = await getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error("Cannot reach the server. Check your internet connection and try again.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const error = new Error(data?.message || "Request failed. Please try again.");
    error.status = res.status;
    throw error;
  }
  return data;
}
