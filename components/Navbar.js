"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LayoutDashboard, LogOut, Menu, Scissors, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close menus when the page changes
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // close the dropdown when clicking outside
  useEffect(() => {
    const close = (e) => dropdownRef.current && !dropdownRef.current.contains(e.target) && setDropdownOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    clearTokenCache();
    toast.success("Logged out successfully.");
    router.push("/");
    router.refresh();
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-plum-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum-700 text-white">
            <Scissors size={16} />
          </span>
          SalonBook
        </Link>

        {/* desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 text-sm font-medium ${isActive(l.href) ? "bg-plum-50 text-plum-800" : "text-stone-600 hover:text-plum-800"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-stone-100" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 rounded-full border border-stone-200 py-1 pl-1 pr-3 hover:bg-stone-50" aria-label="Open profile menu">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum-100 text-sm font-semibold text-plum-800">{user.name?.charAt(0).toUpperCase()}</span>
                )}
                <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">{user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-stone-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-stone-900">{user.name}</p>
                    <p className="truncate text-xs capitalize text-stone-500">{user.role}</p>
                  </div>
                  <Link href="/dashboard" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-plum-50">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/signin" className="btn-outline">Sign In</Link>
              <Link href="/signup" className="btn-primary">Sign Up</Link>
            </div>
          )}
          <button className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 text-sm font-medium ${isActive(l.href) ? "bg-plum-50 text-plum-800" : "text-stone-700"}`}>
                {l.label}
              </Link>
            ))}
            {!user && !isPending && (
              <div className="mt-2 flex gap-2">
                <Link href="/signin" className="btn-outline flex-1">Sign In</Link>
                <Link href="/signup" className="btn-primary flex-1">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
