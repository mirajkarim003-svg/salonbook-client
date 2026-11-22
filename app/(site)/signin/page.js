import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
