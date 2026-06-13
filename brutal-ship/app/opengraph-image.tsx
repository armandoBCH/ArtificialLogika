import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Logika — Agencia de diseño y desarrollo web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#F5F5F5",
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
          borderTop: "8px solid #1A1A1A",
          borderBottom: "8px solid #1A1A1A",
          borderLeft: "8px solid #1A1A1A",
          borderRight: "8px solid #1A1A1A",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "55%",
            justifyContent: "center",
          }}
        >
          {/* Brand name */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                color: "#1A1A1A",
                letterSpacing: "-0.02em",
              }}
            >
              Logika
            </span>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FF6B6B",
                marginLeft: "4px",
                marginTop: "-20px",
                display: "flex",
              }}
            />
          </div>

          {/* Violet accent bar */}
          <div
            style={{
              width: "100px",
              height: "6px",
              backgroundColor: "#8523E1",
              marginBottom: "28px",
              display: "flex",
            }}
          />

          {/* Headline */}
          <span
            style={{
              fontSize: "40px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
              marginBottom: "20px",
            }}
          >
            Tu Web Profesional, Sin Complicaciones.
          </span>

          {/* Subtitle */}
          <span
            style={{
              fontSize: "20px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              color: "#6B6B6B",
              lineHeight: 1.5,
              marginBottom: "32px",
            }}
          >
            Diseño web, landing pages y tiendas online.
          </span>

          {/* Badges row */}
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
                backgroundColor: "#00D68F",
                borderTop: "2px solid #1A1A1A",
                borderBottom: "2px solid #1A1A1A",
                borderLeft: "2px solid #1A1A1A",
                borderRight: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "13px",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              VELOCIDAD
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#8523E1",
                borderTop: "2px solid #1A1A1A",
                borderBottom: "2px solid #1A1A1A",
                borderLeft: "2px solid #1A1A1A",
                borderRight: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "13px",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              DISEÑO WEB
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#4A90FF",
                borderTop: "2px solid #1A1A1A",
                borderBottom: "2px solid #1A1A1A",
                borderLeft: "2px solid #1A1A1A",
                borderRight: "2px solid #1A1A1A",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "13px",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              SEO + HOSTING
            </div>
          </div>
        </div>

        {/* Right Column — Logo card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "320px",
            height: "350px",
            backgroundColor: "#FFFFFF",
            borderTop: "3px solid #1A1A1A",
            borderBottom: "3px solid #1A1A1A",
            borderLeft: "3px solid #1A1A1A",
            borderRight: "3px solid #1A1A1A",
            borderRadius: "16px",
          }}
        >
          {/* Woven Logo Mark — simplified SVG without clipPath */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Shadow */}
            <rect x="22" y="22" width="62" height="62" rx="6" fill="#1A1A1A" />
            {/* Top (Violet) */}
            <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />
            {/* Left (Blue) */}
            <rect x="14" y="14" width="22" height="62" rx="6" fill="#4A90FF" stroke="#1A1A1A" strokeWidth="4" />
            {/* Bottom (Coral) */}
            <rect x="14" y="54" width="62" height="22" rx="6" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="4" />
            {/* Right (Mint) */}
            <rect x="54" y="14" width="22" height="62" rx="6" fill="#00D68F" stroke="#1A1A1A" strokeWidth="4" />
            {/* Top violet woven patch — simple rect instead of clipPath */}
            <rect x="52" y="12" width="26" height="26" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />
          </svg>

          {/* Label under logo */}
          <span
            style={{
              fontSize: "16px",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              color: "#6B6B6B",
              marginTop: "20px",
              letterSpacing: "0.1em",
            }}
          >
            AGENCIA WEB
          </span>
        </div>

        {/* Bottom color stripe */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
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
