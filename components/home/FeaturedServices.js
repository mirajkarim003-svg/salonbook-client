"use client";
import Link from "next/link";
import { useApi } from "@/lib/hooks";
import ServiceCard from "../ServiceCard";
import { PageLoader, ErrorBox, EmptyState } from "../Loader";

export default function FeaturedServices() {
  // 6 newest ACTIVE services
  const { data, loading, error, reload } = useApi("/services?limit=6&sort=newest");

  return (
    <section className="container-page py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-stone-900">Featured services</h2>
          <p className="mt-2 text-stone-600">Popular treatments our customers book most.</p>
        </div>
        <Link href="/services" className="btn-outline">See all services</Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <PageLoader text="Loading services..." />
        ) : error ? (
          <ErrorBox error={error} onRetry={reload} />
        ) : data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((s) => <ServiceCard key={s._id} service={s} />)}
          </div>
        ) : (
          <EmptyState title="No services yet" text="The salon has not added any active services. Please check back soon." />
        )}
      </div>
    </section>
  );
}
