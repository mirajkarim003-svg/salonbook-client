import Link from "next/link";
import { Clock } from "lucide-react";
import ServiceImage from "./ServiceImage";
import { money } from "@/lib/format";

export default function ServiceCard({ service }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <ServiceImage src={service.image} alt={service.serviceName} className="h-48 w-full" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-sage-700">{service.category}</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-stone-900">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-stone-600">{service.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-base font-bold text-plum-800">{money(service.price)}</span>
          <span className="inline-flex items-center gap-1 text-stone-500">
            <Clock size={14} /> {service.duration} min
          </span>
        </div>
        <Link href={`/services/${service._id}`} className="btn-primary mt-4">
          View Details
        </Link>
      </div>
    </article>
  );
}
