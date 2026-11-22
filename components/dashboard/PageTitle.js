export default function PageTitle({ title, text, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900">{title}</h1>
        {text && <p className="mt-1 text-sm text-stone-500">{text}</p>}
      </div>
      {action}
    </div>
  );
}
