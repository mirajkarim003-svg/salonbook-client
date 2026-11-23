# SalonBook - Client (Next.js)

**SalonBook** is a salon appointment booking platform. Customers browse services, request appointments and pay for confirmed ones with Stripe. The salon admin manages services, appointments, customers and payments.

> The backend API lives in the separate **server** repository.

## Important Features
- Public Home page (banner, featured services, categories, "how booking works") and Browse Services page with **search, category filter and price sorting**
- Better Auth: email/password sign up and sign in, **Google login**, profile image upload or URL
- Password rules: min 6 characters, one uppercase, one lowercase
- Protected Service Details page with an appointment booking form (date, time slot, message)
- Customer dashboard: overview, my appointments (view, cancel pending, **Pay Now**), payment history, profile
- Admin dashboard: overview, manage services (add / update / delete / activate / deactivate, ImgBB image upload), manage appointments (confirm / cancel), manage users (block / unblock), transactions (read-only), profile
- Role-based dashboards (a customer cannot open admin pages and vice versa) - also enforced on the server
- Toast notifications, loaders, confirmation dialogs, error pages, responsive layout

## Technology Stack
Next.js (App Router), React, Tailwind CSS v4, Better Auth (+ JWT plugin), MongoDB, react-hot-toast, lucide-react, Stripe (via the server), ImgBB

## How login works (short)
1. Better Auth (inside this app) signs the user in and stores users in the MongoDB `users` collection.
2. The browser asks Better Auth for a **JWT** and sends it to the Express server as `Authorization: Bearer <token>`.
3. The server verifies the token and checks the user's role and blocked status in MongoDB.

## Links
- Live Website: https://salonbook-client-lilac.vercel.app
- Client Repository: https://github.com/mirajkarim003-svg/salonbook-client
- Server Repository: https://github.com/mirajkarim003-svg/salonbook-server
- Admin email / password for evaluators: Admin credentials: provided in the submission form.
