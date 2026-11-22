"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Clock, CreditCard } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money, formatDate, shortId } from "@/lib/format";
import ServiceImage from "@/components/ServiceImage";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal, { DetailRow } from "@/components/Modal";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox, EmptyState, Spinner } from "@/components/Loader";

export default function MyAppointmentsPage() {
  const { data: appointments, loading, error, reload } = useApi("/appointments/my");
  const { data: payments } = useApi("/transactions/my");

  const [details, setDetails] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState(null);

  async function confirmCancel() {
    setCancelling(true);
    try {
      const res = await apiFetch(`/appointments/${cancelTarget._id}/cancel`, { method: "PATCH" });
      toast.success(res.message);
      setCancelTarget(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  }

  async function payNow(appointment) {
    setPayingId(appointment._id);
    try {
      const { url } = await apiFetch("/payments/checkout", { method: "POST", body: { appointmentId: appointment._id } });
      window.location.href = url; // go to Stripe Checkout
    } catch (err) {
      toast.error(err.message);
      setPayingId(null);
    }
  }

  return (
    <>
      <PageTitle title="My appointments" text="Track your requests, cancel pending ones and pay for confirmed ones." />

      {loading ? (
        <PageLoader text="Loading your appointments..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments yet" text="When you request a service it will appear here." action={<Link href="/services" className="btn-primary">Browse services</Link>} />
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <article key={a._id} className="card flex flex-col gap-4 p-4 sm:flex-row">
              <ServiceImage src={a.service?.image} alt={a.service?.serviceName || "Service"} className="h-32 w-full shrink-0 rounded-lg sm:w-40" />
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-stone-900">{a.service?.serviceName || "Service removed"}</h3>
                    <p className="text-sm text-sage-700">{a.service?.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={a.status} />
                    <StatusBadge value={a.paymentStatus} />
                  </div>
                </div>
                <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-stone-600 sm:grid-cols-2">
                  <p>Date: <strong>{formatDate(a.appointmentDate)}</strong></p>
                  <p className="flex items-center gap-1"><Clock size={14} /> Time: <strong>{a.timeSlot}</strong></p>
                  <p>Price: <strong>{money(a.servicePrice)}</strong></p>
                  <p>Requested on: {formatDate(a.createdAt)}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-outline btn-sm" onClick={() => setDetails(a)}>View details</button>
                  {a.status === "pending" && (
                    <button className="btn-outline btn-sm !border-red-300 !text-red-600 hover:!bg-red-50" onClick={() => setCancelTarget(a)}>Cancel request</button>
                  )}
                  {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                    <button className="btn-primary btn-sm" onClick={() => payNow(a)} disabled={payingId === a._id}>
                      {payingId === a._id ? <Spinner className="h-3.5 w-3.5" /> : <CreditCard size={14} />}
                      {payingId === a._id ? "Redirecting to Stripe..." : "Pay Now"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Payment history */}
      <h2 className="mb-3 mt-10 font-display text-xl font-semibold text-stone-900">Payment history</h2>
      {!payments ? null : payments.length === 0 ? (
        <p className="text-sm text-stone-500">No payments yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr><th className="th">Service</th><th className="th">Amount</th><th className="th">Status</th><th className="th">Reference</th><th className="th">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="td">{p.service?.serviceName || "-"}</td>
                  <td className="td">{money(p.amount, p.currency)}</td>
                  <td className="td"><StatusBadge value={p.status} /></td>
                  <td className="td font-mono text-xs">{shortId(p.stripeSessionId)}</td>
                  <td className="td">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!details} title="Appointment details" onClose={() => setDetails(null)}>
        {details && (
          <div>
            <DetailRow label="Service">{details.service?.serviceName}</DetailRow>
            <DetailRow label="Category">{details.service?.category}</DetailRow>
            <DetailRow label="Duration">{details.service?.duration} min</DetailRow>
            <DetailRow label="Date">{formatDate(details.appointmentDate)}</DetailRow>
            <DetailRow label="Time">{details.timeSlot}</DetailRow>
            <DetailRow label="Price">{money(details.servicePrice)}</DetailRow>
            <DetailRow label="Status"><StatusBadge value={details.status} /></DetailRow>
            <DetailRow label="Payment"><StatusBadge value={details.paymentStatus} /></DetailRow>
            <DetailRow label="Requested on">{formatDate(details.createdAt)}</DetailRow>
            <DetailRow label="Your message">{details.message || "-"}</DetailRow>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!cancelTarget}
        danger
        loading={cancelling}
        title="Cancel this appointment request?"
        message="This cannot be undone. You can always request a new appointment later."
        confirmText="Yes, cancel it"
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </>
  );
}
