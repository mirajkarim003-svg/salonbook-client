"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatDate } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal, { DetailRow } from "@/components/Modal";
import PageTitle from "@/components/dashboard/PageTitle";
import { PageLoader, ErrorBox, EmptyState } from "@/components/Loader";

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { data: users, loading, error, reload } = useApi(`/users${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  const [details, setDetails] = useState(null);
  const [target, setTarget] = useState(null); // user to block / unblock
  const [working, setWorking] = useState(false);

  // search after the admin stops typing
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  async function openDetails(user) {
    try {
      setDetails(await apiFetch(`/users/${user._id}`));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function toggleBlock() {
    setWorking(true);
    try {
      const res = await apiFetch(`/users/${target._id}/${target.isBlocked ? "unblock" : "block"}`, { method: "PATCH" });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWorking(false);
      setTarget(null);
    }
  }

  return (
    <>
      <PageTitle title="Manage users" text="View registered customers and block or unblock them." />
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input className="input pl-9" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <PageLoader text="Loading users..." />
      ) : error ? (
        <ErrorBox error={error} onRetry={reload} />
      ) : users.length === 0 ? (
        <EmptyState title="No customers found" text="Customers appear here after they sign up." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr><th className="th">Customer</th><th className="th">Phone</th><th className="th">Joined</th><th className="th">Status</th><th className="th">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="td">
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.image} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-plum-100 text-sm font-semibold text-plum-800">{u.name?.charAt(0).toUpperCase()}</span>
                      )}
                      <div><p className="font-medium text-stone-900">{u.name}</p><p className="text-xs text-stone-500">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="td">{u.phone || "-"}</td>
                  <td className="td">{formatDate(u.createdAt)}</td>
                  <td className="td"><StatusBadge value={u.isBlocked ? "blocked" : "active"} /></td>
                  <td className="td">
                    <div className="flex gap-2">
                      <button className="btn-outline btn-sm" onClick={() => openDetails(u)}>Details</button>
                      <button className={`btn-sm ${u.isBlocked ? "btn-success" : "btn-danger"}`} onClick={() => setTarget(u)}>{u.isBlocked ? "Unblock" : "Block"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!details} title="User details" onClose={() => setDetails(null)}>
        {details && (
          <div>
            <DetailRow label="Name">{details.name}</DetailRow>
            <DetailRow label="Email">{details.email}</DetailRow>
            <DetailRow label="Phone">{details.phone || "-"}</DetailRow>
            <DetailRow label="Role"><span className="capitalize">{details.role}</span></DetailRow>
            <DetailRow label="Status"><StatusBadge value={details.isBlocked ? "blocked" : "active"} /></DetailRow>
            <DetailRow label="Joined">{formatDate(details.createdAt)}</DetailRow>
            <DetailRow label="Total appointments">{details.totalAppointments}</DetailRow>
            <DetailRow label="Paid appointments">{details.paidAppointments}</DetailRow>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!target}
        danger={!target?.isBlocked}
        loading={working}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        message={target?.isBlocked ? "They will be able to use the platform again." : "They will not be able to sign in or use any protected feature."}
        confirmText={target?.isBlocked ? "Yes, unblock" : "Yes, block"}
        onConfirm={toggleBlock}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
