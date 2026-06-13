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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F5F5F8", // Soft Smoke
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
          border: "8px solid #1A1A1A", // Neobrutalist border
        }}
      >
        {/* Subtle background overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundColor: "#8523E1",
            display: "flex",
          }}
        />

        {/* Decorative Floating Shape: Hot Coral Circle in the background */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            backgroundColor: "#FF6B6B",
            opacity: 0.08,
            top: "-100px",
            right: "-50px",
            border: "4px solid #1A1A1A",
            display: "flex",
          }}
        />

        {/* Left Column (60% width) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
            height: "100%",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Logo Brand Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
              gap: "0px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                color: "#1A1A1A",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Logika
            </span>
            {/* Coral Dot with black border */}
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FF6B6B",
                marginLeft: "3px",
                marginBottom: "8px",
                border: "2px solid #1A1A1A",
                display: "flex",
              }}
            />
          </div>

          {/* Accent Divider */}
          <div
            style={{
              width: "120px",
              height: "6px",
              backgroundColor: "#8523E1", // Electric Violet
              border: "2px solid #1A1A1A",
              borderRadius: "4px",
              marginBottom: "24px",
              display: "flex",
            }}
          />

          {/* Core Value Proposition (Space Grotesk) */}
          <span
            style={{
              fontSize: "44px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Tu Web Profesional, Sin Complicaciones.
          </span>

          {/* Supporting short description */}
          <span
            style={{
              fontSize: "20px",
              fontFamily: "Space Grotesk",
              fontWeight: 400,
              color: "#6B6B6B",
              marginTop: "16px",
              marginBottom: "32px",
              lineHeight: 1.4,
            }}
          >
            Creamos páginas web, landing pages y tiendas online rápidas, optimizadas para SEO y listas para vender.
          </span>

          {/* Soft Neobrutalist Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "#00D68F", // Mint Fresh
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#1A1A1A",
                boxShadow: "2px 2px 0px #1A1A1A",
              }}
            >
              ● VELOCIDAD
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#8523E1", // Electric Violet
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#FFFFFF",
                boxShadow: "2px 2px 0px #1A1A1A",
              }}
            >
              ● DISEÑO WEB
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#4A90FF", // Electric Blue
                border: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#FFFFFF",
                boxShadow: "2px 2px 0px #1A1A1A",
              }}
            >
              ● SEO + HOSTING
            </div>
          </div>
        </div>

        {/* Right Column (40% width) - Floating Neobrutalist Card with Logo */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "320px",
            height: "360px",
            zIndex: 10,
          }}
        >
          {/* Card shadow layer */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              width: "100%",
              height: "100%",
              backgroundColor: "#1A1A1A",
              borderRadius: "12px",
              display: "flex",
            }}
          />

          {/* Card main layer */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "#FFFFFF",
              border: "3px solid #1A1A1A",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            {/* Woven Logo Mark */}
            <svg
              width="160"
              height="160"
              viewBox="0 0 100 100"
              fill="none"
            >
              <defs>
                <clipPath id="woven-clip-og">
                  <rect x="45" y="0" width="60" height="100" />
                </clipPath>
              </defs>
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
                x="14"
                y="14"
                width="62"
                height="22"
                rx="6"
                fill="#8523E1"
                stroke="#1A1A1A"
                strokeWidth="4"
                clipPath="url(#woven-clip-og)"
              />
            </svg>

            {/* Rotated ribbon badge */}
            <div
              style={{
                display: "flex",
                backgroundColor: "#FF6B6B", // Hot Coral
                border: "2px solid #1A1A1A",
                borderRadius: "4px",
                padding: "4px 16px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#1A1A1A",
                marginTop: "24px",
                transform: "rotate(-3deg)",
                boxShadow: "2px 2px 0px #1A1A1A",
              }}
            >
              AGENCIA WEB
            </div>
          </div>
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
