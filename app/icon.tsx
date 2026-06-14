import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "linear-gradient(135deg, #b8acfe 0%, #4f3dd4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(79,61,212,0.45)",
        }}
      >
        {/* B mark — top lobe */}
        <div style={{ display: "flex", position: "relative", width: 18, height: 19 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 12,
              height: 9,
              borderRadius: "2px 5px 5px 2px",
              background: "rgba(255,255,255,0.94)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              width: 14,
              height: 9,
              borderRadius: "2px 5px 5px 2px",
              background: "rgba(255,255,255,0.45)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
