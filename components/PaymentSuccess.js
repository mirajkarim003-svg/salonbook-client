"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { money, formatDate } from "@/lib/format";
import { Spinner } from "./Loader";

// Stripe sends the customer here after paying. The payment itself is saved by the
// Stripe WEBHOOK on the server, so this page just waits until the webhook has done its job.
export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [result, setResult] = useState(null);
  const [state, setState] = useState(sessionId ? "checking" : "missing");

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let tries = 0;

    async function check() {
      try {
        const data = await apiFetch(`/payments/session/${sessionId}`);
        if (cancelled) return;
        if (data.confirmed) {
          setResult(data);
          return setState("confirmed");
        }
      } catch {
        // ignore and try again
      }
      tries += 1;
      if (tries >= 10) return !cancelled && setState("delayed");
      setTimeout(check, 2000);
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-12">
      <div className="card max-w-md p-8 text-center">
        {state === "checking" && (
          <>
            <Spinner className="mx-auto h-10 w-10" />
            <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">Confirming your payment...</h1>
            <p className="mt-2 text-stone-600">Please wait a few seconds. Do not close this page.</p>
          </>
        )}
        {state === "confirmed" && (
          <>
            <CheckCircle2 size={52} className="mx-auto text-emerald-500" />
            <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">Payment successful</h1>
            <p className="mt-2 text-stone-600">Thank you! Your appointment is paid and saved.</p>
            <div className="mt-5 rounded-lg bg-stone-50 p-4 text-left text-sm">
              <p><span className="text-stone-500">Service:</span> <strong>{result.serviceName}</strong></p>
              <p><span className="text-stone-500">When:</span> <strong>{formatDate(result.appointmentDate)} at {result.timeSlot}</strong></p>
              <p><span className="text-stone-500">Amount paid:</span> <strong>{money(result.amount, result.currency)}</strong></p>
            </div>
          </>
        )}
        {state === "delayed" && (
          <>
            <h1 className="font-display text-2xl font-bold text-stone-900">We are still confirming</h1>
            <p className="mt-2 text-stone-600">Your payment was received by Stripe, but confirmation is taking longer than usual. Check My Appointments in a minute - the status will change to Paid.</p>
          </>
        )}
        {state === "missing" && (
          <>
            <h1 className="font-display text-2xl font-bold text-stone-900">No payment found</h1>
            <p className="mt-2 text-stone-600">This page needs a payment reference. Open My Appointments to see your payments.</p>
          </>
        )}
        {state !== "checking" && (
          <Link href="/dashboard/customer/appointments" className="btn-primary mt-6">Go to My Appointments</Link>
        )}
      </div>
    </div>
  );
}
