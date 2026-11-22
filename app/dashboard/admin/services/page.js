"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Plus, Power, Search, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money } from "@/lib/format";
import ServiceImage from "@/components/ServiceImage";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox, EmptyState } from "@/components/Loader";

export default function ManageServicesPage() {
  const { data: services, loading, error, reload } = useApi("/services/manage/all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const visible = (services || []).filter((s) => s.serviceName.toLowerCase().includes(search.toLowerCase()));

  async function toggleStatus(service) {
    const status = service.status === "active" ? "inactive" : "active";
    try {
      const res = await apiFetch(`/services/${service._id}/status`, { method: "PATCH", body: { status } });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await apiFetch(`/services/${deleteTarget._id}`, { method: "DELETE" });
      toast.success(res.message);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageTitle
        title="Manage services"
        text="Add, update, delete, activate or deactivate your services."
        action={<Link href="/dashboard/admin/services/add" className="btn-primary"><Plus size={16} /> Add service</Link>}
      />

      {loading ? (
        <PageLoader text="Loading services..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : (
        <>
          <div className="relative mb-4 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input className="input pl-9" placeholder="Search services" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {visible.length === 0 ? (
            <EmptyState title="No services found" text="Add your first service to get started." />
          ) : (
            <div className="card overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr><th className="th">Service</th><th className="th">Category</th><th className="th">Price</th><th className="th">Duration</th><th className="th">Status</th><th className="th">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {visible.map((s) => (
                    <tr key={s._id}>
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <ServiceImage src={s.image} alt={s.serviceName} className="h-12 w-12 shrink-0 rounded-lg" />
                          <span className="font-medium text-stone-900">{s.serviceName}</span>
                        </div>
                      </td>
                      <td className="td">{s.category}</td>
                      <td className="td">{money(s.price)}</td>
                      <td className="td">{s.duration} min</td>
                      <td className="td"><StatusBadge value={s.status} /></td>
                      <td className="td">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/dashboard/admin/services/${s._id}/edit`} className="btn-outline btn-sm"><Pencil size={13} /> Edit</Link>
                          <button className="btn-soft btn-sm" onClick={() => toggleStatus(s)}><Power size={13} /> {s.status === "active" ? "Deactivate" : "Activate"}</button>
                          <button className="btn-sm btn !border !border-red-200 !bg-white !text-red-600 hover:!bg-red-50" onClick={() => setDeleteTarget(s)}><Trash2 size={13} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        loading={deleting}
        title="Delete this service?"
        message={`"${deleteTarget?.serviceName}" will be removed permanently. If you only want to hide it, deactivate it instead.`}
        confirmText="Yes, delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
