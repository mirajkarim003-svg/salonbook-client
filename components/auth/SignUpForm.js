"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { safeRedirect } from "@/lib/format";
import { Spinner } from "../Loader";
import ImageInput from "../ImageInput";
import GoogleButton from "./GoogleButton";

// Password rules: min 6 characters, one uppercase, one lowercase
function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter.";
  return "";
}

export default function SignUpForm() {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get("redirect"));
  const [form, setForm] = useState({ name: "", email: "", password: "", image: "" });
  const [loading, setLoading] = useState(false);
  const passwordError = form.password ? validatePassword(form.password) : "";

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your full name.");
    const problem = validatePassword(form.password);
    if (problem) return toast.error(problem);

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      image: form.image || undefined,
    });
    setLoading(false);
    if (error) return toast.error(error.message || "Could not create your account.");

    clearTokenCache();
    toast.success("Account created! Welcome to SalonBook.");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-stone-900">Create your account</h1>
        <p className="mt-1 text-sm text-stone-500">Sign up to request appointments and track them online.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="At least 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" required />
            <p className={`mt-1 text-xs ${passwordError ? "text-red-600" : "text-stone-400"}`}>
              {passwordError || "Use at least 6 characters with one uppercase and one lowercase letter."}
            </p>
          </div>
          <ImageInput label="Profile image (optional)" value={form.image} onChange={(image) => setForm({ ...form, image })} allowUrl />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />} {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-stone-400">
          <span className="h-px flex-1 bg-stone-200" /> or <span className="h-px flex-1 bg-stone-200" />
        </div>
        <GoogleButton redirectTo={redirectTo} text="Sign up with Google" />

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account? <Link href="/signin" className="font-semibold text-plum-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
