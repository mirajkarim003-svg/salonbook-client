"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import ImageInput from "../ImageInput";
import { Spinner } from "../Loader";

// Used for both "Add service" and "Update service".
// Pass `service` to edit an existing one.
export default function ServiceForm({ service }) {
  const router = useRouter();
  const editing = Boolean(service);
  const [form, setForm] = useState({
    serviceName: service?.serviceName || "",
    category: service?.category || "",
    description: service?.description || "",
    price: service?.price ?? "",
    duration: service?.duration ?? "",
    image: service?.image || "",
    status: service?.status || "active", // default: Active
  });
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.serviceName.trim().length < 3) return toast.error("Service name must be at least 3 characters.");
    if (!form.category) return toast.error("Please choose a category.");
    if (form.description.trim().length < 10) return toast.error("Description must be at least 10 characters.");
    if (!(Number(form.price) > 0)) return toast.error("Price must be a positive number.");
    if (!(Number(form.duration) > 0)) return toast.error("Duration must be a positive number.");
    if (!form.image) return toast.error("Please upload a service image.");

    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), duration: Number(form.duration) };
      const res = editing
        ? await apiFetch(`/services/${service._id}`, { method: "PUT", body })
        : await apiFetch("/services", { method: "POST", body });
      toast.success(res.message);
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5 p-6">
      <div>
        <label className="label" htmlFor="serviceName">Service name</label>
        <input id="serviceName" className="input" value={form.serviceName} onChange={set("serviceName")} placeholder="e.g. Signature Haircut" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category">Service category</label>
          <select id="category" className="input" value={form.category} onChange={set("category")} required>
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Service status</label>
          <select id="status" className="input" value={form.status} onChange={set("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="price">Price (USD)</label>
          <input id="price" type="number" min="0.01" step="0.01" className="input" value={form.price} onChange={set("price")} required />
        </div>
        <div>
          <label className="label" htmlFor="duration">Estimated duration (minutes)</label>
          <input id="duration" type="number" min="1" step="1" className="input" value={form.duration} onChange={set("duration")} required />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" rows={4} className="input" value={form.description} onChange={set("description")} placeholder="Describe what is included in this service." required />
      </div>
      <ImageInput label="Service image" value={form.image} onChange={(image) => setForm({ ...form, image })} />
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Spinner className="h-4 w-4" />} {saving ? "Saving..." : editing ? "Update service" : "Add service"}
        </button>
        <button type="button" className="btn-outline" onClick={() => router.push("/dashboard/admin/services")} disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
