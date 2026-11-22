"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../Loader";

export default function GoogleButton({ redirectTo = "/dashboard", text = "Continue with Google" }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirectTo });
      if (error) throw new Error(error.message);
    } catch (err) {
      toast.error(err.message || "Google sign in failed.");
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className="btn-outline w-full">
      {loading ? <Spinner className="h-4 w-4" /> : (
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.800 2.400 30.300 0 24 0 14.600 0 6.500 5.400 2.600 13.200l7.900 6.100C12.400 13.600 17.700 9.500 24 9.500z" />
          <path fill="#4285F4" d="M46.500 24.500c0-1.600-.1-3.100-.4-4.500H24v9h12.700c-.6 3-2.300 5.500-4.800 7.200l7.500 5.800c4.400-4.100 7.100-10.100 7.100-17.500z" />
          <path fill="#FBBC05" d="M10.500 28.700c-.5-1.400-.8-3-.8-4.700s.3-3.200.8-4.700l-7.900-6.100C.900 16.400 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z" />
          <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.500-5.800c-2.100 1.400-4.800 2.300-8.400 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
        </svg>
      )}
      {text}
    </button>
  );
}
