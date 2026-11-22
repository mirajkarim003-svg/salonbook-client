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

## Installation
```bash
cd client
npm install
cp .env.example .env.local     # then fill in the values (see below)
```

## How to Run Locally
Start the **server** first (see the server README), then:
```bash
npm run dev      # http://localhost:3000
npm run build    # production build check
npm start        # run the production build
```

## Required Environment Variables (names only)
| Name | Meaning |
|------|---------|
| `BETTER_AUTH_URL` | URL of this Next.js app |
| `NEXT_PUBLIC_API_URL` | URL of the Express server |
| `BETTER_AUTH_SECRET` | Long random secret for Better Auth |
| `MONGODB_URI` | MongoDB connection string (same DB as the server) |
| `DB_NAME` | Database name (same as the server) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `IMGBB_API_KEY` | ImgBB API key (used only on the server side of Next.js) |

Never commit `.env.local`.

## How login works (short)
1. Better Auth (inside this app) signs the user in and stores users in the MongoDB `users` collection.
2. The browser asks Better Auth for a **JWT** and sends it to the Express server as `Authorization: Bearer <token>`.
3. The server verifies the token and checks the user's role and blocked status in MongoDB.

## Links
- Live Website: _add your live link here_
- Client Repository: _add your client GitHub link here_
- Server Repository: _add your server GitHub link here_
- Admin email / password for evaluators: _add in the submission form (do not put the password in the README)_
