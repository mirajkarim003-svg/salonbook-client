"use client";

export default function GlobalError({ error, reset }) {
  return (
    <main className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-2xl font-semibold text-stone-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-stone-600">{error?.message || "An unexpected error happened."}</p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </main>
  );
}
