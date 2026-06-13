// Generate a static OG image (1200x630) from SVG using sharp
// Run: node generate-og.mjs

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#F5F5F5"/>
  
  <!-- Top + sides thick border -->
  <rect x="0" y="0" width="1200" height="8" fill="#1A1A1A"/>
  <rect x="0" y="622" width="1200" height="8" fill="#1A1A1A"/>
  <rect x="0" y="0" width="8" height="630" fill="#1A1A1A"/>
  <rect x="1192" y="0" width="8" height="630" fill="#1A1A1A"/>

  <!-- Bottom color stripe -->
  <rect x="8" y="616" width="296" height="6" fill="#8523E1"/>
  <rect x="304" y="616" width="296" height="6" fill="#4A90FF"/>
  <rect x="600" y="616" width="296" height="6" fill="#FF6B6B"/>
  <rect x="896" y="616" width="296" height="6" fill="#00D68F"/>

  <!-- LEFT COLUMN -->
  
  <!-- "Logika" text -->
  <text x="80" y="195" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="72" fill="#1A1A1A" letter-spacing="-1.5">Logika</text>
  
  <!-- Coral dot -->
  <circle cx="355" cy="175" r="8" fill="#FF6B6B"/>
  
  <!-- Violet accent bar -->
  <rect x="80" y="220" width="100" height="6" rx="3" fill="#8523E1"/>
  
  <!-- Headline -->
  <text x="80" y="290" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="42" fill="#1A1A1A">Tu Web Profesional,</text>
  <text x="80" y="342" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="42" fill="#1A1A1A">Sin Complicaciones.</text>
  
  <!-- Subtitle -->
  <text x="80" y="395" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="400" font-size="20" fill="#6B6B6B">Diseño web, landing pages y tiendas online en Argentina.</text>

  <!-- Badge: VELOCIDAD -->
  <rect x="80" y="435" width="130" height="36" rx="6" fill="#00D68F"/>
  <rect x="80" y="435" width="130" height="36" rx="6" stroke="#1A1A1A" stroke-width="2" fill="none"/>
  <text x="107" y="459" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="13" fill="#1A1A1A">VELOCIDAD</text>

  <!-- Badge: DISEÑO WEB -->
  <rect x="222" y="435" width="140" height="36" rx="6" fill="#8523E1"/>
  <rect x="222" y="435" width="140" height="36" rx="6" stroke="#1A1A1A" stroke-width="2" fill="none"/>
  <text x="243" y="459" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="13" fill="#FFFFFF">DISEÑO WEB</text>

  <!-- Badge: SEO + HOSTING -->
  <rect x="374" y="435" width="160" height="36" rx="6" fill="#4A90FF"/>
  <rect x="374" y="435" width="160" height="36" rx="6" stroke="#1A1A1A" stroke-width="2" fill="none"/>
  <text x="395" y="459" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="13" fill="#FFFFFF">SEO + HOSTING</text>

  <!-- RIGHT COLUMN — Logo card -->
  
  <!-- Card shadow -->
  <rect x="758" y="122" width="340" height="380" rx="16" fill="#1A1A1A"/>
  
  <!-- Card main -->
  <rect x="748" y="112" width="340" height="380" rx="16" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="3"/>

  <!-- Woven Logo Mark centered in card -->
  <!-- Shadow -->
  <rect x="877" y="202" width="93" height="93" rx="9" fill="#1A1A1A"/>
  <!-- Top (Violet) -->
  <rect x="867" y="192" width="93" height="33" rx="9" fill="#8523E1" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Left (Blue) -->
  <rect x="867" y="192" width="33" height="93" rx="9" fill="#4A90FF" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Bottom (Coral) -->
  <rect x="867" y="252" width="93" height="33" rx="9" fill="#FF6B6B" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Right (Mint) -->
  <rect x="927" y="192" width="33" height="93" rx="9" fill="#00D68F" stroke="#1A1A1A" stroke-width="4"/>
  <!-- Top violet woven patch -->
  <rect x="927" y="190" width="35" height="37" rx="9" fill="#8523E1" stroke="#1A1A1A" stroke-width="4"/>

  <!-- Label under logo -->
  <text x="918" y="360" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="16" fill="#6B6B6B" text-anchor="middle" letter-spacing="2">AGENCIA WEB</text>
  
  <!-- Argentina flag accent -->
  <text x="918" y="410" font-family="'Space Grotesk', 'Arial', sans-serif" font-weight="700" font-size="14" fill="#8523E1" text-anchor="middle" letter-spacing="1">logikaweb.com.ar</text>
</svg>
`;

const outputPath = join(__dirname, "public", "og-image.png");

await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(outputPath);

console.log("✓ Generated og-image.png (1200x630)");

// Also check the dimensions
const metadata = await sharp(outputPath).metadata();
console.log(`  Dimensions: ${metadata.width}x${metadata.height}`);
console.log(`  Format: ${metadata.format}`);
console.log(`  Size: ${(await sharp(outputPath).toBuffer()).length} bytes`);
