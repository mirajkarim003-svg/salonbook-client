"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarDays, Clock, Tag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money } from "@/lib/format";
import ServiceImage from "@/components/ServiceImage";
import { PageLoader, Spinner } from "@/components/Loader";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const role = session?.user?.role;

  const { data: service, loading, error } = useApi(`/services/${id}`);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <PageLoader text="Loading service..." />;

  if (error || !service) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          {error?.status === 400 ? "Invalid service link" : "Service not found"}
        </h1>
        <p className="mt-2 max-w-md text-stone-600">{error?.message || "We could not load this service."}</p>
        <Link href="/services" className="btn-primary mt-6">Browse all services</Link>
      </div>
    );
  }

  const isActive = service.status === "active";

  return (
    <div className="container-page py-10">
      <Link href="/services" className="text-sm font-medium text-plum-700 hover:underline">&larr; Back to services</Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ServiceImage src={service.image} alt={service.serviceName} className="h-72 w-full rounded-xl sm:h-96" />

        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-700">
            <Tag size={12} /> {service.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-stone-900">{service.serviceName}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <span className="font-display text-3xl font-bold text-plum-800">{money(service.price)}</span>
            <span className="inline-flex items-center gap-1.5 text-stone-600"><Clock size={16} /> About {service.duration} minutes</span>
          </div>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-stone-600">{service.description}</p>

          <div className="mt-8">
            {!isActive ? (
              <p className="rounded-lg bg-stone-100 p-4 text-sm text-stone-600">This service is currently inactive and cannot be booked.</p>
            ) : role === "admin" ? (
              <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">You are signed in as an admin. Admins cannot submit customer appointment requests.</p>
            ) : showForm ? null : (
              <button className="btn-primary px-6 py-3" onClick={() => setShowForm(true)}>
                <CalendarDays size={18} /> Book an Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && isActive && role === "customer" && (
        <BookingForm service={service} onDone={() => router.push("/dashboard/customer/appointments")} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
}

function BookingForm({ service, onDone, onCancel }) {
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState({ timeSlots: [], bookedSlots: [] });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // when a date is chosen, ask the server which slots are already taken
  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSlot("");
    apiFetch(`/appointments/booked-slots?date=${date}`)
      .then((data) => !cancelled && setSlots(data))
      .catch((err) => !cancelled && toast.error(err.message))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date) return toast.error("Please choose a date.");
    if (!slot) return toast.error("Please choose a time slot.");
    setSubmitting(true);
    try {
      const res = await apiFetch("/appointments", {
        method: "POST",
        body: { serviceId: service._id, appointmentDate: date, timeSlot: slot, message },
      });
      toast.success(res.message);
      onDone();
    } catch (err) {
      toast.error(err.message); // for example: "This time slot is already booked"
      if (err.status === 409 && date) {
        apiFetch(`/appointments/booked-slots?date=${date}`).then(setSlots).catch(() => {});
        setSlot("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto mt-10 max-w-2xl p-6">
      <h2 className="font-display text-xl font-semibold text-stone-900">Request an appointment</h2>
      <p className="mt-1 text-sm text-stone-500">{service.serviceName} &middot; {money(service.price)}. You pay after the salon confirms your request.</p>

      <div className="mt-5">
        <label className="label" htmlFor="date">Appointment date</label>
        <input id="date" type="date" min={today} className="input sm:max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="mt-5">
        <span className="label">Available time slot</span>
        {!date ? (
          <p className="text-sm text-stone-500">Choose a date to see the open time slots.</p>
        ) : loadingSlots ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {slots.timeSlots.map((t) => {
              const taken = slots.bookedSlots.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  disabled={taken}
                  onClick={() => setSlot(t)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    slot === t ? "border-plum-700 bg-plum-700 text-white" : taken ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 line-through" : "border-stone-300 hover:border-plum-500"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5">
        <label className="label" htmlFor="message">Additional message (optional)</label>
        <textarea id="message" rows={3} maxLength={500} className="input" placeholder="Anything the stylist should know?" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="mt-6 flex gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting && <Spinner className="h-4 w-4" />} {submitting ? "Sending request..." : "Send request"}
        </button>
        <button type="button" className="btn-outline" onClick={onCancel} disabled={submitting}>Cancel</button>
      </div>
    </form>
  );
}
