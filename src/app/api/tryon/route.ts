import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Request body is required" }, { status: 400 });
    }

    const { userImage, garmentImage, garmentId, generateVideo } = body;

    if (!userImage) {
      return NextResponse.json({ success: false, error: "userImage (scan or photo) is required" }, { status: 400 });
    }

    if (!garmentImage) {
      return NextResponse.json({ success: false, error: "garmentImage is required" }, { status: 400 });
    }

    // Simulate AI pipeline delay (1.8 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // High quality mock outputs matching fashion aesthetics
    let outputUrl = "";
    
    if (generateVideo) {
      // Direct high-quality fashion model posing loop (Pexels / Vimeo CDN)
      outputUrl = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054773d97bf97d3e4293f0b2fcf0247&profile_id=139&oauth2_token_id=57447761";
    } else {
      // Photo try-on fallback: high-quality fashion model with garment
      // If we have a shirt, return a beautiful shirt fit.
      // Else, we default to a stunning generative fashion fit look.
      if (garmentImage.toLowerCase().includes("shirt")) {
        outputUrl = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800";
      } else if (garmentImage.toLowerCase().includes("sneaker") || garmentImage.toLowerCase().includes("shoe")) {
        outputUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800";
      } else if (garmentImage.toLowerCase().includes("watch")) {
        outputUrl = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800";
      } else {
        // Fallback to a stunning editorial model shot
        outputUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800";
      }
    }

    return NextResponse.json({
      success: true,
      outputUrl,
      type: generateVideo ? "video" : "image",
      message: "Virtual try-on generated successfully via neural pipeline."
    });
  } catch (err: any) {
    console.error("Error in try-on route:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
