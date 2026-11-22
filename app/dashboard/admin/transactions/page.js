"use client";
import { useApi } from "@/lib/hooks";
import { money, formatDate, shortId } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox, EmptyState } from "@/components/Loader";

// Read-only on purpose: payments are created ONLY by the verified Stripe webhook.
export default function TransactionsPage() {
  const { data: transactions, loading, error, reload } = useApi("/transactions");

  return (
    <>
      <PageTitle title="Transactions" text="Payments recorded from verified Stripe events. These records cannot be edited." />
      {loading ? (
        <PageLoader text="Loading transactions..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : transactions.length === 0 ? (
        <EmptyState title="No transactions yet" text="Paid appointments will show up here." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr><th className="th">Customer</th><th className="th">Service</th><th className="th">Appointment</th><th className="th">Amount</th><th className="th">Currency</th><th className="th">Stripe session</th><th className="th">Status</th><th className="th">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td className="td"><p className="font-medium text-stone-900">{t.customer?.name || "-"}</p><p className="text-xs text-stone-500">{t.customer?.email}</p></td>
                  <td className="td">{t.service?.serviceName || "-"}</td>
                  <td className="td whitespace-nowrap">{t.appointment ? `${formatDate(t.appointment.appointmentDate)}, ${t.appointment.timeSlot}` : "-"}</td>
                  <td className="td font-medium">{money(t.amount, t.currency)}</td>
                  <td className="td uppercase">{t.currency}</td>
                  <td className="td font-mono text-xs" title={t.stripeSessionId}>{shortId(t.stripeSessionId)}</td>
                  <td className="td"><StatusBadge value={t.status} /></td>
                  <td className="td whitespace-nowrap">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
