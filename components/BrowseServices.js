"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import ServiceCard from "./ServiceCard";
import { PageLoader, ErrorBox, EmptyState } from "./Loader";

export default function BrowseServices() {
  const router = useRouter();
  const params = useSearchParams();

  // filters live in the URL, so links like /services?category=Makeup work
  const [search, setSearch] = useState(params.get("search") || "");
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  function updateUrl(changes) {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    router.replace(`/services?${next.toString()}`, { scroll: false });
  }

  // wait 400ms after typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((params.get("search") || "") !== search.trim()) updateUrl({ search: search.trim() });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const urlSearch = params.get("search") || "";
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const query = new URLSearchParams();
    if (urlSearch) query.set("search", urlSearch);
    if (category) query.set("category", category);
    query.set("sort", sort);
    apiFetch(`/services?${query.toString()}`)
      .then((data) => !cancelled && setServices(data))
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [urlSearch, category, sort, retry]);

  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-stone-900">Browse services</h1>
        <p className="mt-2 text-stone-600">Search by name, filter by category and sort by price.</p>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_200px]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className="input pl-9" placeholder="Search services by name" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" />
        </div>
        <select className="input" value={category} onChange={(e) => updateUrl({ category: e.target.value })} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => updateUrl({ sort: e.target.value })} aria-label="Sort services">
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <PageLoader text="Loading services..." />
        ) : error ? (
          <ErrorBox error={error} onRetry={() => setRetry((n) => n + 1)} />
        ) : services.length === 0 ? (
          <EmptyState
            title="No services found"
            text="Try a different search word or choose another category."
            action={<button className="btn-outline" onClick={() => { setSearch(""); router.replace("/services"); }}>Clear filters</button>}
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-stone-500">{services.length} service{services.length === 1 ? "" : "s"} found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
