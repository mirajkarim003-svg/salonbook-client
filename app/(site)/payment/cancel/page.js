import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-12">
      <div className="card max-w-md p-8 text-center">
        <XCircle size={48} className="mx-auto text-red-500" />
        <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">Payment cancelled</h1>
        <p className="mt-2 text-stone-600">No money was taken. Your appointment is still confirmed and you can pay any time from My Appointments.</p>
        <Link href="/dashboard/customer/appointments" className="btn-primary mt-6">Back to My Appointments</Link>
      </div>
    </div>
  );
}
