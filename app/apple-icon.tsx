import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #b8acfe 0%, #4f3dd4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", position: "relative", width: 100, height: 108 }}>
          {/* Top lobe */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 68,
              height: 52,
              borderRadius: "6px 28px 28px 6px",
              background: "rgba(255,255,255,0.94)",
            }}
          />
          {/* Bottom lobe */}
          <div
            style={{
              position: "absolute",
              top: 56,
              left: 0,
              width: 80,
              height: 52,
              borderRadius: "6px 30px 30px 6px",
              background: "rgba(255,255,255,0.45)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
