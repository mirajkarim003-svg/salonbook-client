"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { PageLoader } from "@/components/Loader";

// /dashboard sends each person to the dashboard of their role
export default function DashboardRedirect() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (role) router.replace(role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }, [role, router]);

  return <PageLoader text="Opening your dashboard..." />;
}
