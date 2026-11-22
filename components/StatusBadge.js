const styles = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  cancelled: "bg-red-100 text-red-700",
  paid: "bg-emerald-100 text-emerald-800",
  unpaid: "bg-stone-200 text-stone-700",
  failed: "bg-red-100 text-red-700",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-stone-200 text-stone-600",
  blocked: "bg-red-100 text-red-700",
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[value] || "bg-stone-100 text-stone-700"}`}>
      {value}
    </span>
  );
}
