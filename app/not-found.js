import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-display text-6xl font-bold text-plum-700">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-stone-900">This page does not exist</h1>
        <p className="mt-2 max-w-md text-stone-600">The link may be broken or the page may have been moved.</p>
        <Link href="/" className="btn-primary mt-6">Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
