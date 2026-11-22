// Uploads one image to ImgBB. The ImgBB key stays here on the server (never sent to the browser).
export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json({ message: "Image upload is not configured (IMGBB_API_KEY is missing)." }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return Response.json({ message: "No image was sent." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return Response.json({ message: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ message: "Image must be smaller than 5 MB." }, { status: 400 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const body = new FormData();
    body.append("image", base64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return Response.json({ message: data?.error?.message || "ImgBB rejected the image." }, { status: 502 });
    }
    return Response.json({ url: data.data.display_url || data.data.url });
  } catch {
    return Response.json({ message: "Image upload failed. Please try again." }, { status: 500 });
  }
}
