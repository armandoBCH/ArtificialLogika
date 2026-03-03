import codecs

file_path = r'c:\Users\armad\Desktop\Proyectos\Artificial Logika\Lista-BaAs.html'

with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

# Lines 174-188 (0-indexed: 173-187) contain the broken badges
# Replace them with the fixed version
new_block = [
    '        <!-- MEGA BADGE BIENVENIDA CON DECORACION -->\r\n',
    '        <g transform="translate(60, 90) rotate(-2)">\r\n',
    '          <!-- Destellos decorativos NEOBRUTALES alrededor del banner -->\r\n',
    '          <path d="M -20 -30 L 0 -10 L -20 10 L -40 -10 Z" fill="#FDE047" class="stroke-black" filter="url(#hardShadowSmall)" opacity="0.9"/>\r\n',
    '          <circle cx="630" cy="-10" r="14" fill="#8523E1" class="stroke-black" filter="url(#hardShadowSmall)"/>\r\n',
    '          <path d="M 640 90 L 650 75 L 660 90 L 675 100 L 660 110 L 650 125 L 640 110 L 625 100 Z" fill="#FF6B6B" class="stroke-black" filter="url(#hardShadowSmall)"/>\r\n',
    '\r\n',
    '          <rect x="0" y="0" width="600" height="90" rx="20" fill="#00D68F" class="stroke-black" filter="url(#hardShadow)"/>\r\n',
    '          \r\n',
    '          <!-- Icono SVG Estrella Magica -->\r\n',
    '          <g transform="translate(45, 25)">\r\n',
    '            <path d="M 20 0 L 25 15 L 40 20 L 25 25 L 20 40 L 15 25 L 0 20 L 15 15 Z" fill="#FDE047" class="stroke-black"/>\r\n',
    '          </g>\r\n',
    '\r\n',
    '          <text x="330" y="60" class="font-main" fill="#1A1A1A" font-size="40" font-weight="800" text-anchor="middle" letter-spacing="1">BIENVENIDOS A LOGIKA!</text>\r\n',
    '        </g>\r\n',
    '\r\n',
    '        <!-- BADGE DURA VERDAD (ACHICADO / DESPLAZADO ARRIBA) -->\r\n',
    '        <g transform="translate(80, 215)">\r\n',
    '          <rect x="0" y="0" width="220" height="46" rx="23" fill="#FF6B6B" class="stroke-black" filter="url(#hardShadowSmall)"/>\r\n',
    '          \r\n',
    '          <!-- Icono SVG Alerta (Rombo con exclamacion) -->\r\n',
    '          <g transform="translate(20, 11)">\r\n',
    '             <path d="M 12 0 L 24 12 L 12 24 L 0 12 Z" fill="#FDE047" class="stroke-black"/>\r\n',
    '             <circle cx="12" cy="12" r="4" fill="#1A1A1A"/>\r\n',
    '          </g>\r\n',
    '          \r\n',
    '          <text x="130" y="29" class="font-main" fill="#1A1A1A" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1.5">DURA VERDAD</text>\r\n',
    '        </g>\r\n',
]

# Replace lines 173 to 187 (0-indexed) with the new block
lines[173:188] = new_block

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.writelines(lines)

print("Listo! Badges reemplazados correctamente.")
