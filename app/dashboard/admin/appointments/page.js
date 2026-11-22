"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money, formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal, { DetailRow } from "@/components/Modal";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox, EmptyState } from "@/components/Loader";

export default function ManageAppointmentsPage() {
  const [filter, setFilter] = useState("");
  const { data: appointments, loading, error, reload } = useApi(`/appointments${filter ? `?status=${filter}` : ""}`);
  const [details, setDetails] = useState(null);
  const [action, setAction] = useState(null); // { type: "confirm" | "cancel", appointment }
  const [working, setWorking] = useState(false);

  async function runAction() {
    setWorking(true);
    try {
      const res = await apiFetch(`/appointments/${action.appointment._id}/${action.type}`, { method: "PATCH" });
      toast.success(res.message);
      setAction(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      setAction(null);
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <PageTitle title="Manage appointments" text="Review requests, confirm or cancel them." />

      <div className="mb-4 max-w-xs">
        <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <PageLoader text="Loading appointments..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments found" text="New requests from customers will appear here." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr><th className="th">Customer</th><th className="th">Service</th><th className="th">Date &amp; time</th><th className="th">Price</th><th className="th">Status</th><th className="th">Payment</th><th className="th">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td className="td"><p className="font-medium text-stone-900">{a.customer?.name || "Deleted user"}</p><p className="text-xs text-stone-500">{a.customer?.email}</p></td>
                  <td className="td">{a.service?.serviceName || "Service removed"}</td>
                  <td className="td whitespace-nowrap">{formatDate(a.appointmentDate)}<br /><span className="text-xs text-stone-500">{a.timeSlot}</span></td>
                  <td className="td">{money(a.servicePrice)}</td>
                  <td className="td"><StatusBadge value={a.status} /></td>
                  <td className="td"><StatusBadge value={a.paymentStatus} /></td>
                  <td className="td">
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-outline btn-sm" onClick={() => setDetails(a)}>Details</button>
                      {a.status === "pending" && <button className="btn-success btn-sm" onClick={() => setAction({ type: "confirm", appointment: a })}>Confirm</button>}
                      {(a.status === "pending" || a.status === "confirmed") && <button className="btn-danger btn-sm" onClick={() => setAction({ type: "cancel", appointment: a })}>Cancel</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!details} title="Appointment details" onClose={() => setDetails(null)}>
        {details && (
          <div>
            <DetailRow label="Customer">{details.customer?.name}</DetailRow>
            <DetailRow label="Email">{details.customer?.email}</DetailRow>
            <DetailRow label="Phone">{details.customer?.phone || "-"}</DetailRow>
            <DetailRow label="Service">{details.service?.serviceName}</DetailRow>
            <DetailRow label="Category">{details.service?.category}</DetailRow>
            <DetailRow label="Date">{formatDate(details.appointmentDate)}</DetailRow>
            <DetailRow label="Time">{details.timeSlot}</DetailRow>
            <DetailRow label="Price">{money(details.servicePrice)}</DetailRow>
            <DetailRow label="Status"><StatusBadge value={details.status} /></DetailRow>
            <DetailRow label="Payment"><StatusBadge value={details.paymentStatus} /></DetailRow>
            <DetailRow label="Requested on">{formatDate(details.createdAt)}</DetailRow>
            <DetailRow label="Customer message">{details.message || "-"}</DetailRow>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!action}
        danger={action?.type === "cancel"}
        loading={working}
        title={action?.type === "confirm" ? "Confirm this appointment?" : "Cancel this appointment?"}
        message={action?.type === "confirm" ? "The customer will be able to pay for it from their dashboard." : "The customer will see it as cancelled. If it was already paid, refund it in your Stripe dashboard."}
        confirmText={action?.type === "confirm" ? "Yes, confirm" : "Yes, cancel"}
        onConfirm={runAction}
        onCancel={() => setAction(null)}
      />
    </>
  );
}
