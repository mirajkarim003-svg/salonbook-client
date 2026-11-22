import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Scissors } from "lucide-react";
import { SALON } from "@/lib/constants";

// Simple social icons (drawn here so we do not need extra packages)
const socials = [
  { name: "Facebook", href: "https://facebook.com", path: "M13 22v-8h3l.5-4H13V8c0-1.1.3-2 2-2h1.7V2.6C16.3 2.5 15.3 2.4 14.2 2.4 11.7 2.4 10 3.9 10 6.7V10H7v4h3v8h3z" },
  { name: "Instagram", href: "https://instagram.com", path: "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-3a1 1 0 100 2 1 1 0 000-2z" },
  { name: "X", href: "https://x.com", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-plum-900 text-plum-100">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-plum-800">
              <Scissors size={16} />
            </span>
            SalonBook
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-plum-200">
            Book hair, skin, nail and spa services online. Pick a service, choose a time and pay securely once the salon confirms.
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className="flex h-9 w-9 items-center justify-center rounded-full bg-plum-800 hover:bg-plum-700">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-white"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> {SALON.phone}</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> {SALON.email}</li>
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {SALON.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-white">Opening Hours</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {SALON.hours.map(([day, time]) => (
              <li key={day} className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 shrink-0" />
                <span><span className="text-white">{day}:</span> {time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-plum-800 py-5 text-center text-xs text-plum-300">
        &copy; {new Date().getFullYear()} SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
