"use client";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useApi } from "@/lib/hooks";
import { authClient } from "@/lib/auth-client";
import StatCard from "@/components/StatCard";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox } from "@/components/Loader";

export default function CustomerOverview() {
  const { data: session } = authClient.useSession();
  const { data: stats, loading, error, reload } = useApi("/stats/customer");

  return (
    <>
      <PageTitle title={`Hello, ${session?.user?.name || ""}`} text="Here is a quick look at your appointment requests." />
      {loading ? (
        <PageLoader text="Loading dashboard..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Total appointment requests" value={stats.total} icon={CalendarCheck} />
            <StatCard label="Pending appointments" value={stats.pending} icon={Clock3} tone="amber" />
            <StatCard label="Confirmed appointments" value={stats.confirmed} icon={CheckCircle2} tone="sage" />
            <StatCard label="Cancelled appointments" value={stats.cancelled} icon={XCircle} tone="red" />
          </div>
          <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h2 className="font-display text-lg font-semibold text-stone-900">Ready for your next treatment?</h2>
              <p className="text-sm text-stone-500">Browse services and request a time that suits you.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/services" className="btn-primary">Browse services</Link>
              <Link href="/dashboard/customer/appointments" className="btn-outline">My appointments</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
