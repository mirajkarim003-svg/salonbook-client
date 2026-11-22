"use client";
import { Spinner } from "./Loader";

// A simple modal that asks "Are you sure?"
export default function ConfirmDialog({ open, title, message, confirmText = "Confirm", danger = false, loading = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="font-display text-lg font-semibold text-stone-900">{title}</h3>
        <p className="mt-2 text-sm text-stone-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-outline" onClick={onCancel} disabled={loading}>
            No, go back
          </button>
          <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />} {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
