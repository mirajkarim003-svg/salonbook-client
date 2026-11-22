"use client";
import Link from "next/link";
import { Brush, Flower2, Hand, Heart, Palette, Scissors, Sparkles } from "lucide-react";
import { useApi } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/constants";

const icons = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Palette,
  "Hair Treatment": Sparkles,
  "Facial & Skincare": Flower2,
  Makeup: Brush,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Heart,
};

export default function CategoriesSection() {
  const { data } = useApi("/services/categories");
  const counts = Object.fromEntries((data || []).map((c) => [c.name, c.count]));

  return (
    <section className="bg-plum-50 py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-stone-900">Browse by category</h2>
          <p className="mt-3 text-stone-600">Pick a category to see only the services you care about.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((name) => {
            const Icon = icons[name] || Scissors;
            return (
              <Link key={name} href={`/services?category=${encodeURIComponent(name)}`} className="card flex flex-col items-center gap-3 p-6 text-center transition hover:border-plum-300 hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-plum-100 text-plum-700"><Icon size={22} /></span>
                <span className="font-display font-semibold text-stone-900">{name}</span>
                {data && <span className="text-xs text-stone-500">{counts[name] || 0} services</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
