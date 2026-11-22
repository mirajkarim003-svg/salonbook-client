import ServiceForm from "@/components/dashboard/ServiceForm";
import PageTitle from "@/components/dashboard/PageTitle";

export default function AddServicePage() {
  return (
    <>
      <PageTitle title="Add new service" text="This service will be visible to customers when its status is Active." />
      <ServiceForm />
    </>
  );
}
