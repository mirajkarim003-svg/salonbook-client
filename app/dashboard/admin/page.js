"use client";
import { CalendarCheck, CheckCircle2, Clock3, CreditCard, Scissors, Users } from "lucide-react";
import { useApi } from "@/lib/hooks";
import StatCard from "@/components/StatCard";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox } from "@/components/Loader";

export default function AdminOverview() {
  const { data: s, loading, error, reload } = useApi("/stats/admin");

  return (
    <>
      <PageTitle title="Admin overview" text="A snapshot of your salon." />
      {loading ? (
        <PageLoader text="Loading dashboard..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Registered customers" value={s.customers} icon={Users} />
          <StatCard label="Active services" value={s.activeServices} icon={Scissors} tone="sage" />
          <StatCard label="Total appointment requests" value={s.totalAppointments} icon={CalendarCheck} tone="sky" />
          <StatCard label="Pending appointments" value={s.pending} icon={Clock3} tone="amber" />
          <StatCard label="Confirmed appointments" value={s.confirmed} icon={CheckCircle2} tone="sage" />
          <StatCard label="Successful payments" value={s.successfulPayments} icon={CreditCard} />
        </div>
      )}
    </>
  );
}
