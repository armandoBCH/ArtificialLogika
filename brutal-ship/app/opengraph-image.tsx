import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Logika — Agencia de diseño y desarrollo web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Load Space Grotesk Bold for the text
  const spaceGroteskBold = fetch(
    new URL(
      "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.ttf"
    )
  ).then((res) => res.arrayBuffer());

  const fontData = await spaceGroteskBold;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1A1A",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(133,35,225,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "48px",
            position: "relative",
          }}
        >
          {/* Woven Logo Mark */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Shadow */}
            <rect x="22" y="22" width="62" height="62" rx="6" fill="#1A1A1A" />
            {/* Top (Violet) */}
            <rect
              x="14"
              y="14"
              width="62"
              height="22"
              rx="6"
              fill="#8523E1"
              stroke="#1A1A1A"
              strokeWidth="4"
            />
            {/* Left (Blue) */}
            <rect
              x="14"
              y="14"
              width="22"
              height="62"
              rx="6"
              fill="#4A90FF"
              stroke="#1A1A1A"
              strokeWidth="4"
            />
            {/* Bottom (Coral) */}
            <rect
              x="14"
              y="54"
              width="62"
              height="22"
              rx="6"
              fill="#FF6B6B"
              stroke="#1A1A1A"
              strokeWidth="4"
            />
            {/* Right (Mint) */}
            <rect
              x="54"
              y="14"
              width="22"
              height="62"
              rx="6"
              fill="#00D68F"
              stroke="#1A1A1A"
              strokeWidth="4"
            />
            {/* Top (Violet) Patch for woven effect */}
            <rect
              x="45"
              y="14"
              width="31"
              height="22"
              rx="0"
              fill="#8523E1"
            />
            <rect
              x="54"
              y="12"
              width="24"
              height="4"
              rx="0"
              fill="#1A1A1A"
            />
          </svg>

          {/* Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                gap: "0px",
              }}
            >
              <span
                style={{
                  fontSize: "96px",
                  fontFamily: "Space Grotesk",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Logika
              </span>
              {/* Coral dot */}
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  backgroundColor: "#FF6B6B",
                  marginLeft: "4px",
                  marginBottom: "8px",
                  display: "flex",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "28px",
                fontFamily: "Space Grotesk",
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
              }}
            >
              Tu Web Profesional, Sin Complicaciones
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#8523E1", display: "flex" }} />
          <div style={{ flex: 1, backgroundColor: "#4A90FF", display: "flex" }} />
          <div style={{ flex: 1, backgroundColor: "#FF6B6B", display: "flex" }} />
          <div style={{ flex: 1, backgroundColor: "#00D68F", display: "flex" }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
