"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "./Loader";
import ServiceImage from "./ServiceImage";

// Uploads a picture to ImgBB (through our /api/upload route) and gives back the link.
// allowUrl = true  -> user may also paste an image link (sign up / profile)
export default function ImageInput({ value, onChange, allowUrl = false, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState("upload");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB.");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Image upload failed.");
      onChange(data.url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="label !mb-0">{label}</span>
        {allowUrl && (
          <button type="button" className="text-xs font-medium text-plum-700 hover:underline" onClick={() => setMode(mode === "upload" ? "url" : "upload")}>
            {mode === "upload" ? "Use image link instead" : "Upload a file instead"}
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        {value ? (
          <ServiceImage src={value} alt="Preview" className="h-20 w-20 shrink-0 rounded-lg" />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-300 text-xs text-stone-400">No image</div>
        )}
        <div className="flex-1">
          {mode === "upload" ? (
            <label className="btn-outline cursor-pointer">
              {uploading ? <Spinner className="h-4 w-4" /> : null}
              {uploading ? "Uploading..." : value ? "Change image" : "Choose image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          ) : (
            <input type="url" className="input" placeholder="https://example.com/photo.jpg" value={value || ""} onChange={(e) => onChange(e.target.value)} />
          )}
          <p className="mt-1 text-xs text-stone-400">JPG, PNG or WebP up to 5 MB.</p>
        </div>
      </div>
    </div>
  );
}
