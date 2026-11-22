"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarCheck, CreditCard, LayoutDashboard, PlusCircle, Scissors, UserCircle, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { PageLoader } from "@/components/Loader";

const menus = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarCheck },
    { href: "/dashboard/customer/profile", label: "My Profile", icon: UserCircle },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors, exact: true },
    { href: "/dashboard/admin/services/add", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: CalendarCheck },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: UserCircle },
  ],
};

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  const role = user?.role;
  // A customer opening /dashboard/admin/... (or the other way round) is not allowed
  const wrongArea =
    user && pathname !== "/dashboard" && !pathname.startsWith(`/dashboard/${role === "admin" ? "admin" : "customer"}`);

  useEffect(() => {
    if (isPending) return;
    if (!user) router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    else if (wrongArea) {
      toast.error("You do not have access to that dashboard.");
      router.replace("/dashboard");
    }
  }, [isPending, user, wrongArea, pathname, router]);

  async function handleLogout() {
    await authClient.signOut();
    clearTokenCache();
    router.push("/signin");
  }

  if (isPending || !user || wrongArea) {
    return (
      <>
        <Navbar />
        <PageLoader text="Checking your access..." />
      </>
    );
  }

  // Blocked users cannot use the platform
  if (user.isBlocked) {
    return (
      <>
        <Navbar />
        <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-2xl font-semibold text-stone-900">Your account is blocked</h1>
          <p className="mt-2 max-w-md text-stone-600">You cannot use the dashboard right now. Please contact the salon for help.</p>
          <button onClick={handleLogout} className="btn-primary mt-6">Logout</button>
        </div>
      </>
    );
  }

  const items = menus[role === "admin" ? "admin" : "customer"];
  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <>
      <Navbar />
      <div className="container-page flex flex-col gap-6 py-6 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="card p-3 lg:sticky lg:top-24">
            <p className="hidden px-3 pb-2 pt-1 text-xs font-semibold text-stone-400 lg:block">
              {role === "admin" ? "Admin dashboard" : "Customer dashboard"}
            </p>
            <nav className="flex gap-1 overflow-x-auto lg:flex-col">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(item) ? "bg-plum-700 text-white" : "text-stone-600 hover:bg-plum-50 hover:text-plum-800"
                  }`}
                >
                  <item.icon size={17} /> {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </>
  );
}
