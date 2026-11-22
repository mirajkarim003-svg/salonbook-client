export function Spinner({ className = "h-5 w-5" }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-plum-200 border-t-plum-700 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

// Big centered loader used while a page is fetching data
export function PageLoader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-stone-500">
      <Spinner className="h-9 w-9" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-700">Something went wrong</p>
      <p className="mt-1 text-sm text-red-600">{error?.message || "Please try again."}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-stone-800">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
