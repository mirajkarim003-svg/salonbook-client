"use client";
import { useState } from "react";

// Shows the service photo. If the link is broken, shows a soft colored box instead.
export default function ServiceImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-plum-100 to-sage-100 font-display text-2xl text-plum-600 ${className}`}>
        {alt?.charAt(0) || "S"}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
