import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(135deg, #0B0B0F 0%, #16101F 100%)",
        color: "#F5F5F7",
      }}
    >
      <div
        style={{
          width: "140px",
          height: "10px",
          borderRadius: "9999px",
          background: "linear-gradient(90deg, #818CF8, #A78BFA, #F472B6)",
        }}
      />
      <div style={{ fontSize: "84px", fontWeight: 800, letterSpacing: "-2px", marginTop: "40px" }}>
        {site.name}
      </div>
      <div style={{ fontSize: "34px", color: "#9A9AA6", marginTop: "24px", maxWidth: "960px" }}>
        {site.description}
      </div>
    </div>,
    { ...size },
  );
}
