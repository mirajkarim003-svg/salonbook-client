import { Suspense } from "react";
import PaymentSuccess from "@/components/PaymentSuccess";
import { PageLoader } from "@/components/Loader";

export const metadata = { title: "Payment successful" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentSuccess />
    </Suspense>
  );
}
