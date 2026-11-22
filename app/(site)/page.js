import Link from "next/link";
import { CalendarCheck, CreditCard, Search, Sparkles } from "lucide-react";
import FeaturedServices from "@/components/home/FeaturedServices";
import CategoriesSection from "@/components/home/CategoriesSection";

const steps = [
  { icon: Search, title: "Find a service", text: "Browse services, search by name and compare prices and durations." },
  { icon: CalendarCheck, title: "Request a time", text: "Choose a date and an open time slot. The salon reviews your request." },
  { icon: Sparkles, title: "Get confirmed", text: "Once the salon confirms, your appointment shows as Confirmed." },
  { icon: CreditCard, title: "Pay securely", text: "Pay online with Stripe from your dashboard, then simply show up." },
];

export default function HomePage() {
  return (
    <>
      {/* Banner */}
      <section
        className="relative bg-plum-900 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-plum-900/90 via-plum-900/70 to-plum-900/30" />
        <div className="container-page relative py-24 sm:py-32">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Your next appointment, booked in a minute.
            </h1>
            <p className="mt-5 text-lg text-plum-100">
              Haircuts, color, skincare, nails and spa treatments. Choose a service, pick a time and let the salon confirm. No phone calls needed.
            </p>
            <Link href="/services" className="btn mt-8 bg-white px-6 py-3 text-base text-plum-800 hover:bg-plum-50">
              Explore Salon Services
            </Link>
          </div>
        </div>
      </section>

      <FeaturedServices />
      <CategoriesSection />

      {/* Extra section: how it works (a real sequence, so numbers make sense) */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-stone-900">How booking works</h2>
          <p className="mt-3 text-stone-600">Four simple steps from browsing to your chair.</p>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-50 text-sage-700"><s.icon size={20} /></span>
                <span className="text-sm font-semibold text-stone-400">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
