"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useApi } from "@/lib/hooks";
import ImageInput from "../ImageInput";
import PageTitle from "./PageTitle";
import { PageLoader, ErrorBox, Spinner } from "../Loader";

// Used by both Customer and Admin. Only name, image and phone can be changed.
export default function ProfileForm() {
  const { data: profile, loading, error, reload } = useApi("/users/me");
  const { refetch } = authClient.useSession();
  const [form, setForm] = useState({ name: "", image: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ name: profile.name || "", image: profile.image || "", phone: profile.phone || "" });
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters.");
    setSaving(true);
    try {
      const res = await apiFetch("/users/me", { method: "PATCH", body: form });
      toast.success(res.message);
      refetch?.(); // update the name/photo in the navbar right away
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageLoader text="Loading profile..." />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  return (
    <>
      <PageTitle title="My profile" text="Update your name, photo and phone number." />
      <form onSubmit={handleSubmit} className="card max-w-xl space-y-5 p-6">
        <ImageInput label="Profile image" value={form.image} onChange={(image) => setForm({ ...form, image })} allowUrl />
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" value={profile.email} disabled />
          <p className="mt-1 text-xs text-stone-400">Email cannot be changed.</p>
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone number</label>
          <input id="phone" className="input" placeholder="+1 555 000 1234" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3 text-sm">
          <span className="text-stone-500">Account role</span>
          <span className="font-semibold capitalize text-stone-800">{profile.role}</span>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Spinner className="h-4 w-4" />} {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </>
  );
}
