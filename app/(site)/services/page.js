import { Suspense } from "react";
import BrowseServices from "@/components/BrowseServices";
import { PageLoader } from "@/components/Loader";

export const metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <Suspense fallback={<PageLoader text="Loading services..." />}>
      <BrowseServices />
    </Suspense>
  );
}
