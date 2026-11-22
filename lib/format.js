export const money = (n, currency = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(Number(n) || 0);

// "2026-11-25" -> "Nov 25, 2026"
export function formatDate(value) {
  if (!value) return "-";
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export const shortId = (id = "") => (id.length > 16 ? `${id.slice(0, 10)}...${id.slice(-4)}` : id);

// only allow safe redirect paths like "/services/123"
export const safeRedirect = (value, fallback = "/dashboard") =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
