import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "BYUND — Infrastructure You Can Trust";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#050609",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(114,96,251,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern lines - horizontal */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            zIndex: 1,
          }}
        >
          {/* Icon mark */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "linear-gradient(135deg, #b8acfe 0%, #4f3dd4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 36,
              boxShadow: "0 0 80px rgba(114,96,251,0.5)",
            }}
          >
            <div style={{ display: "flex", position: "relative", width: 56, height: 60 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 38, height: 28, borderRadius: "4px 16px 16px 4px", background: "rgba(255,255,255,0.94)" }} />
              <div style={{ position: "absolute", top: 32, left: 0, width: 44, height: 28, borderRadius: "4px 17px 17px 4px", background: "rgba(255,255,255,0.45)" }} />
            </div>
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: "-4px",
              color: "white",
              marginBottom: 20,
            }}
          >
            BYUND
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Infrastructure You Can Trust
          </div>

          {/* Divider + product name */}
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.15)" }} />
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "rgba(164,150,253,0.8)",
                textTransform: "uppercase",
              }}
            >
              A NIPPYSKY LIMITED PRODUCT
            </div>
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
