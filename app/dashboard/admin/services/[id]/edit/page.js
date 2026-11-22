"use client";
import { useParams } from "next/navigation";
import { useApi } from "@/lib/hooks";
import ServiceForm from "@/components/dashboard/ServiceForm";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox } from "@/components/Loader";

export default function EditServicePage() {
  const { id } = useParams();
  const { data: service, loading, error, reload } = useApi(`/services/${id}`);

  return (
    <>
      <PageTitle title="Update service" text="Change the details and save." />
      {loading ? <PageLoader text="Loading service..." /> : error ? <ErrorBox error={error} onRetry={reload} /> : <ServiceForm service={service} />}
    </>
  );
}
