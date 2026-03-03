"use client";

import { useEffect, useRef, useState } from "react";

interface LogikaLogoProps {
    className?: string;
}

export default function LogikaLogo({ className = "" }: LogikaLogoProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (wrapperRef.current) {
            observer.observe(wrapperRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} className={`logika-logo-wrapper ${isVisible ? "active" : ""} ${className}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .logika-logo-wrapper { display: inline-flex; align-items: center; }
                .logika-logo-wrapper * { box-sizing: border-box; }
                .logika-logo-wrapper svg { overflow: visible; }
                .logika-logo-wrapper svg * { transform-box: fill-box; }

                /* 1. Traslación del logo entero */
                .logika-logo-wrapper #logo-master {
                    transform: translateX(115px);
                }
                .logika-logo-wrapper.active #logo-master {
                    animation: lk-slide-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
                }

                /* 2. Pop-in de TODO el logo (incluida la sombra) */
                .logika-logo-wrapper #logo-pop {
                    transform-origin: center;
                    transform: scale(0);
                    opacity: 0;
                }
                .logika-logo-wrapper.active #logo-pop {
                    animation: lk-pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                /* 3. Rotación "Mecánica" de ida y vuelta */
                .logika-logo-wrapper #logo-spin {
                    transform-origin: center;
                    transform: rotate(0deg);
                }
                .logika-logo-wrapper.active #logo-spin {
                    animation: lk-spin-and-return 1.2s forwards;
                    animation-delay: 1.2s;
                }

                /* 4. Animación del texto "Logika" */
                .logika-logo-wrapper #logika-text {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                .logika-logo-wrapper.active #logika-text {
                    animation: lk-text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.3s forwards;
                }

                /* 5. Animación del punto Hot Coral */
                .logika-logo-wrapper #logika-dot {
                    transform: scale(0);
                    transform-origin: center;
                }
                .logika-logo-wrapper.active #logika-dot {
                    animation: lk-dot-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2.3s forwards;
                }

                /* --- Keyframes --- */
                @keyframes lk-slide-left {
                    0% { transform: translateX(115px); }
                    100% { transform: translateX(0px); }
                }

                @keyframes lk-pop-in {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes lk-spin-and-return {
                    0% {
                        transform: rotate(0deg);
                        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    40% {
                        transform: rotate(90deg);
                    }
                    60% {
                        transform: rotate(90deg);
                        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    100% {
                        transform: rotate(0deg);
                    }
                }

                @keyframes lk-text-reveal {
                    0% { opacity: 0; transform: translateX(-30px); }
                    100% { opacity: 1; transform: translateX(0); }
                }

                @keyframes lk-dot-pop {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }
                `
            }} />
            {isVisible && (
                <svg
                    viewBox="0 0 360 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 'auto', height: '100%' }}
                >
                    <defs>
                        <clipPath id="woven-clip">
                            <rect x="45" y="0" width="60" height="100" />
                        </clipPath>
                        <clipPath id="text-mask">
                            <rect x="86" y="-20" width="300" height="140" />
                        </clipPath>
                    </defs>

                    {/* Grupo 1: Texto y Punto (Fondo) */}
                    <g clipPath="url(#text-mask)">
                        <g id="logika-text">
                            <text x="94" y="72" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="62" fill="currentColor" className="text-ink-black dark:text-white" letterSpacing="-0.02em">Logika</text>
                        </g>
                        {/* Punto Coral súper pegado al texto */}
                        <circle id="logika-dot" cx="304" cy="68" r="8" fill="#FF6B6B" stroke="currentColor" className="text-ink-black dark:text-white" strokeWidth="3" />
                    </g>

                    {/* Grupo 2: Logo Mark (Woven Frame) */}
                    <g id="logo-master">
                        <g id="logo-pop">
                            {/* Sombra */}
                            <rect x="22" y="22" width="62" height="62" rx="6" fill="#1A1A1A" />

                            {/* Rotación */}
                            <g id="logo-spin">
                                <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />
                                <rect x="14" y="14" width="22" height="62" rx="6" fill="#4A90FF" stroke="#1A1A1A" strokeWidth="4" />
                                <rect x="14" y="54" width="62" height="22" rx="6" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="4" />
                                <rect x="54" y="14" width="22" height="62" rx="6" fill="#00D68F" stroke="#1A1A1A" strokeWidth="4" />
                                <rect x="14" y="14" width="62" height="22" rx="6" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" clipPath="url(#woven-clip)" />
                            </g>
                        </g>
                    </g>
                </svg>
            )}
        </div>
    );
}
