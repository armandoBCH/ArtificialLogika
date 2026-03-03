interface LogikaIconProps {
    size?: number;
    className?: string;
}

/**
 * Logo original estático de Logika (sin animación ni texto).
 * Cuadrado con barras entrelazadas: Violeta, Azul, Coral, Menta.
 */
export default function LogikaIcon({ size = 44, className = "" }: LogikaIconProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            className={className}
        >
            <defs>
                <clipPath id="woven-clip-icon">
                    <rect x="45" y="0" width="60" height="100" />
                </clipPath>
            </defs>
            {/* Sombra */}
            <rect x="22" y="22" width="62" height="62" rx="6" fill="#1A1A1A" />
            {/* Top (Violet) */}
            <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />
            {/* Left (Blue) */}
            <rect x="14" y="14" width="22" height="62" rx="6" fill="#4A90FF" stroke="#1A1A1A" strokeWidth="4" />
            {/* Bottom (Coral) */}
            <rect x="14" y="54" width="62" height="22" rx="6" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="4" />
            {/* Right (Mint) */}
            <rect x="54" y="14" width="22" height="62" rx="6" fill="#00D68F" stroke="#1A1A1A" strokeWidth="4" />
            {/* Top (Violet) Patch — continuidad del entrelazado */}
            <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" clipPath="url(#woven-clip-icon)" />
        </svg>
    );
}
