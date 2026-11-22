import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: { default: "SalonBook - Salon Appointment Booking", template: "%s | SalonBook" },
  description: "Explore salon services, request an appointment online and pay securely once it is confirmed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
