"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { safeRedirect } from "@/lib/format";
import { Spinner } from "../Loader";
import GoogleButton from "./GoogleButton";

export default function SignInForm() {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get("redirect"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please enter your email and password.");
    setLoading(true);
    const { error } = await authClient.signIn.email({ email: form.email, password: form.password });
    setLoading(false);
    if (error) return toast.error(error.message || "Invalid email or password.");

    clearTokenCache();
    toast.success("Welcome back! Signed in successfully.");
    router.push(redirectTo); // /dashboard sends each role to its own dashboard
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-stone-900">Sign in</h1>
        <p className="mt-1 text-sm text-stone-500">Welcome back. Sign in to manage your appointments.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />} {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-stone-400">
          <span className="h-px flex-1 bg-stone-200" /> or <span className="h-px flex-1 bg-stone-200" />
        </div>
        <GoogleButton redirectTo={redirectTo} text="Sign in with Google" />

        <p className="mt-6 text-center text-sm text-stone-600">
          New to SalonBook? <Link href="/signup" className="font-semibold text-plum-700 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
