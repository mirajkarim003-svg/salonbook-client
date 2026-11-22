export default function StatCard({ label, value, icon: Icon, tone = "plum" }) {
  const tones = {
    plum: "bg-plum-50 text-plum-700",
    sage: "bg-sage-50 text-sage-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && (
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={22} />
        </span>
      )}
      <div>
        <p className="text-sm text-stone-500">{label}</p>
        <p className="font-display text-2xl font-bold text-stone-900">{value}</p>
      </div>
    </div>
  );
}
