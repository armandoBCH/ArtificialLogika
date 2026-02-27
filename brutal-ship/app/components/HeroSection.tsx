"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [entryComplete, setEntryComplete] = useState(false);
    const heroRef = useRef<HTMLElement>(null);

    const { scrollY } = useScroll();
    // Parallax values for abstract shapes
    const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

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

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const sentence1 = "Tu Web".split("");
    const sentence2 = "Profesional.".split("");

    const letterVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } }
    };

    return (
        <header ref={heroRef} className="relative overflow-hidden bg-background-light dark:bg-background-dark pt-36 pb-24 border-b-2 border-black">
            {/* Abstract Shapes */}
            <motion.div style={{ y: y1 }} className="absolute top-20 right-[-50px] w-64 h-64 bg-mint rounded-full border-2 border-black mix-blend-multiply opacity-80 hidden lg:block z-0 animate-pulse"></motion.div>
            <motion.div style={{ y: y2 }} className="absolute bottom-10 left-10 w-32 h-32 bg-accent-yellow border-2 border-black transform rotate-12 z-0 hidden lg:block"></motion.div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-block bg-accent-yellow border-2 border-black px-4 py-1 font-bold text-sm shadow-neobrutalism-sm transform -rotate-2 rounded">
                            ✨ NOS ENCARGAMOS DE TODO
                        </div>
                        <motion.div
                            animate={entryComplete ? { y: [0, -4, 0] } : {}}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <motion.h1
                                initial="hidden"
                                animate={isVisible ? "visible" : "hidden"}
                                variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                                onAnimationComplete={(definition) => {
                                    if (definition === "visible") setEntryComplete(true);
                                }}
                                className="text-[clamp(3rem,12vw,6rem)] lg:text-[clamp(3rem,5vw,5.5rem)] font-bold leading-[0.9] tracking-tighter uppercase flex flex-col"
                            >
                                <div className="flex overflow-hidden pb-2 -mb-2">
                                    {sentence1.map((char, index) => (
                                        <motion.span key={index} variants={letterVariants} className="inline-block">
                                            {char === " " ? "\u00A0" : char}
                                        </motion.span>
                                    ))}
                                </div>
                                <div className="flex overflow-hidden pb-4 -mb-4">
                                    <span className="text-transparent bg-clip-text bg-primary text-stroke whitespace-nowrap flex">
                                        {sentence2.map((char, index) => (
                                            <motion.span key={index} variants={letterVariants} className="inline-block">
                                                {char}
                                            </motion.span>
                                        ))}
                                    </span>
                                </div>
                            </motion.h1>
                        </motion.div>
                        <p className="text-xl md:text-2xl font-medium border-l-4 border-primary pl-6 py-2 max-w-lg">
                            Diseñamos y creamos la página web que tu negocio necesita. Vos no te preocupás por nada — nosotros nos encargamos de todo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <MagneticWrapper>
                                <a href="#contacto" className="w-full sm:w-auto bg-primary text-white border-2 border-black font-bold text-lg py-4 px-8 shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg flex items-center justify-center gap-2">
                                    Contactanos
                                    <span className="material-icons">arrow_forward</span>
                                </a>
                            </MagneticWrapper>
                            <a href="#portafolio" className="md:hidden flex items-center justify-center gap-2 text-black dark:text-white font-bold text-lg py-2 mt-2 underline decoration-2 underline-offset-4">
                                Ver Nuestro Trabajo
                                <span className="material-icons text-sm">open_in_new</span>
                            </a>
                            <a href="#portafolio" className="hidden md:block bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black font-bold text-lg py-4 px-8 shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg text-center">
                                Ver Nuestro Trabajo
                            </a>
                        </div>
                        <div className="flex items-center gap-2 mt-6 bg-[#00f090] text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#000] w-fit transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                            <span className="material-icons text-black text-lg">verified</span>
                            <span className="font-extrabold text-sm uppercase tracking-wide">Mockup y Presupuesto Sin Cargo</span>
                        </div>
                    </div>
                    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto -mt-6 lg:-mt-12">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .hero-svg-wrapper * { box-sizing: border-box; }
                            .hero-svg-wrapper svg * { transform-box: fill-box; }
                            .hero-svg-wrapper .scene-fade { animation: global-fade-out 6s infinite; transform-origin: center; }
                            .hero-svg-wrapper .reveal-1 { animation: slide-down 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .reveal-2 { animation: slide-right 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: left; }
                            .hero-svg-wrapper .reveal-3 { animation: slide-left 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: right; }
                            .hero-svg-wrapper .reveal-4 { animation: scale-up 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .reveal-5 { animation: slide-up-right 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .reveal-6 { animation: pop-up 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: bottom; }
                            .hero-svg-wrapper .reveal-7 { animation: float-in 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .reveal-8 { animation: slide-up-tilt-left 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .reveal-9 { animation: slide-up-tilt-right 6s cubic-bezier(0.2, 1.2, 0.3, 1.1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .shape-intro { animation: pop-in 6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; transform-origin: center; }
                            .hero-svg-wrapper .mint-highlight { animation: draw-highlight 6s cubic-bezier(0.22, 1, 0.36, 1) infinite; transform-origin: left center; }
                            .hero-svg-wrapper .marquee-track { animation: marquee-scroll 6s linear infinite; }
                            .hero-svg-wrapper .float { animation: float-y 4s ease-in-out infinite; }
                            .hero-svg-wrapper .spin { animation: spin-slow 8s linear infinite; transform-origin: center; }
                            .hero-svg-wrapper .blink { animation: text-blink 1s step-end infinite; }
                            .hero-svg-wrapper .cursor-anim { animation: fly-click 6s ease-in-out infinite; }
                            .hero-svg-wrapper .btn-press { animation: btn-hover-down 6s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
                            .hero-svg-wrapper .starburst-anim { animation: explode-star 6s ease-out infinite; transform-origin: center; }
                            .hero-svg-wrapper .ring-burst { animation: expand-ring 6s ease-out infinite; transform-origin: center; }
                            .hero-svg-wrapper .bar-grow { animation: bar-grow 6s cubic-bezier(0.22, 1, 0.36, 1) infinite; transform-origin: bottom; }
                            .hero-svg-wrapper .toggle-slide { animation: toggle-right 6s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
                            .hero-svg-wrapper .progress-fill { animation: fill-width 6s ease-out infinite; }
                            .hero-svg-wrapper .draw-path { stroke-dasharray: 120; stroke-dashoffset: 120; animation: draw-line 6s ease-in-out infinite; }

                            @keyframes global-fade-out { 0%, 94% { opacity: 1; filter: blur(0px); } 98%, 100% { opacity: 0; filter: blur(4px); } }
                            @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                            @keyframes pop-in { 0% { transform: scale(0); opacity: 0; } 5%, 100% { transform: scale(1); opacity: 1; } }
                            @keyframes draw-highlight { 0%, 18% { transform: scaleX(0); opacity: 0; } 22%, 100% { transform: scaleX(1); opacity: 1; } }
                            @keyframes slide-down { 0%, 2% { transform: translateY(-30px); opacity: 0; } 12%, 100% { transform: translateY(0); opacity: 1; } }
                            @keyframes slide-right { 0%, 5% { transform: translateX(-50px) skewX(5deg); opacity: 0; } 15%, 100% { transform: translateX(0) skewX(0); opacity: 1; } }
                            @keyframes slide-left { 0%, 8% { transform: translateX(50px); opacity: 0; } 18%, 100% { transform: translateX(0); opacity: 1; } }
                            @keyframes scale-up { 0%, 11% { transform: scale(0.7) rotate(-2deg); opacity: 0; } 21%, 100% { transform: scale(1) rotate(0); opacity: 1; } }
                            @keyframes slide-up-right { 0%, 14% { transform: translate(-30px, 30px); opacity: 0; } 24%, 100% { transform: translate(0, 0); opacity: 1; } }
                            @keyframes pop-up { 0%, 17% { transform: translateY(40px) scale(0.9); opacity: 0; } 27%, 100% { transform: translateY(0) scale(1); opacity: 1; } }
                            @keyframes float-in { 0%, 20% { transform: translate(80px, -20px) scale(0.9) rotate(5deg); opacity: 0; } 30%, 100% { transform: translate(0, 0) scale(1) rotate(0); opacity: 1; } }
                            @keyframes slide-up-tilt-left { 0%, 23% { transform: translateY(60px) rotate(-6deg); opacity: 0; } 33%, 100% { transform: translateY(0) rotate(0); opacity: 1; } }
                            @keyframes slide-up-tilt-right { 0%, 26% { transform: translateY(60px) rotate(6deg); opacity: 0; } 36%, 100% { transform: translateY(0) rotate(0); opacity: 1; } }
                            @keyframes float-y { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
                            @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            @keyframes text-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
                            @keyframes fly-click { 0%, 43% { transform: translate(1200px, 800px); opacity: 0; } 48% { transform: translate(500px, 600px); opacity: 1; } 52% { transform: translate(180px, 450px); opacity: 1; } 56%, 58% { transform: translate(186px, 456px) scale(0.9); opacity: 1; } 60% { transform: translate(180px, 450px) scale(1); opacity: 1; } 66% { transform: translate(750px, 600px); opacity: 1; } 72%, 100% { transform: translate(1200px, 800px); opacity: 0; } }
                            @keyframes btn-hover-down { 0%, 50% { transform: translate(0, 0) scale(1); } 52%, 55% { transform: translate(-2px, -2px) scale(1.02); } 56%, 58% { transform: translate(6px, 6px) scale(0.98); } 59%, 100% { transform: translate(0, 0) scale(1); } }
                            @keyframes explode-star { 0%, 55% { transform: scale(0) rotate(-45deg); opacity: 0; } 56% { transform: scale(1.5) rotate(0deg); opacity: 1; } 62% { transform: scale(2.5) rotate(45deg); opacity: 0; } 100% { opacity: 0; } }
                            @keyframes expand-ring { 0%, 55% { r: 10; opacity: 0; stroke-width: 12px; } 56% { r: 40; opacity: 1; stroke-width: 6px; } 62% { r: 100; opacity: 0; stroke-width: 0px; } 100% { opacity: 0; } }
                            @keyframes bar-grow { 0%, 30% { transform: scaleY(0); } 35%, 100% { transform: scaleY(1); } }
                            @keyframes toggle-right { 0%, 38% { transform: translateX(0); } 42%, 100% { transform: translateX(20px); } }
                            @keyframes fill-width { 0%, 38% { width: 0; } 45%, 100% { width: 140px; } }
                            @keyframes draw-line { 0%, 38% { stroke-dashoffset: 120; } 48%, 100% { stroke-dashoffset: 0; } }
                        `}} />
                        <div className="bg-white dark:bg-zinc-900 border-4 border-black rounded-xl shadow-[16px_16px_0px_#1A1A1A] overflow-hidden transform transition-all duration-300 hero-svg-wrapper flex flex-col">
                            {/* Browser Header */}
                            <div className="bg-[#E5E5E5] border-b-4 border-black px-5 py-3.5 flex items-center gap-2.5 relative z-10 w-full">
                                <div className="w-4 h-4 rounded-full bg-[#FF6B6B] border-[3px] border-black"></div>
                                <div className="w-4 h-4 rounded-full bg-[#FFD93D] border-[3px] border-black"></div>
                                <div className="w-4 h-4 rounded-full bg-[#00D68F] border-[3px] border-black"></div>
                                <div className="ml-5 bg-white border-[3px] border-black rounded-[20px] px-4 py-1 text-sm font-bold text-center flex-grow max-w-[300px] text-[#1A1A1A]">
                                    www.tunegocio.com
                                </div>
                            </div>
                            {/* SVG Canvas */}
                            <div className="w-full aspect-[4/3] bg-white relative">
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-multiply z-50">
                                    <filter id="noiseFilter">
                                        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                                        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.08 0" />
                                    </filter>
                                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                                </svg>
                                {isVisible && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet" className="w-full h-full block relative z-10">
                                        <defs>
                                            <pattern id="grid-pattern-hero" width="50" height="50" patternUnits="userSpaceOnUse">
                                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E5E5E5" strokeWidth="2" />
                                                <circle cx="0" cy="0" r="1.5" fill="#1A1A1A" opacity="0.3" />
                                            </pattern>
                                        </defs>

                                        <g className="scene-fade">
                                            <rect width="1000" height="750" fill="#FFFFFF" />
                                            <rect width="1000" height="750" fill="url(#grid-pattern-hero)" />

                                            <g className="shape-intro">
                                                <g className="spin" style={{ transformOrigin: '900px 150px' }}>
                                                    <path d="M890 150 L910 150 M900 140 L900 160 M893 143 L907 157 M893 157 L907 143" stroke="#FFD93D" strokeWidth="6" strokeLinecap="round" />
                                                </g>
                                                <circle cx="100" cy="650" r="24" fill="none" stroke="#4D96FF" strokeWidth="4" strokeDasharray="10 5" className="spin" style={{ transformOrigin: '100px 650px' }} />
                                                <rect x="850" y="600" width="30" height="30" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="3" transform="rotate(25 865 615)" className="float" />
                                            </g>

                                            <g className="reveal-1">
                                                <rect x="-4" y="-4" width="1008" height="44" fill="#FFD93D" stroke="#1A1A1A" strokeWidth="4" />
                                                <g className="marquee-track">
                                                    <text x="0" y="24" fontWeight="900" fontSize="14" fill="#1A1A1A" letterSpacing="1">
                                                        🚀 IMPULSA TU NEGOCIO CON NUESTRA NUEVA PLATAFORMA DIGITAL · DISEÑO NEOBRUTALISTA DE ALTO IMPACTO · 🚀 IMPULSA TU NEGOCIO CON NUESTRA NUEVA PLATAFORMA DIGITAL · DISEÑO NEOBRUTALISTA DE ALTO IMPACTO ·
                                                    </text>
                                                </g>
                                            </g>

                                            <g className="reveal-2">
                                                <rect x="-4" y="36" width="1008" height="74" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4" />
                                                <text x="60" y="82" fontWeight="900" fontSize="28" fill="#1A1A1A" letterSpacing="-1">TUNEGOCIO<tspan fill="#8523E1">.</tspan></text>
                                                <text x="940" y="80" fontWeight="700" fontSize="15" fill="#1A1A1A" textAnchor="end" xmlSpace="preserve">Inicio   ·   Servicios   ·   Casos   ·   Contacto</text>
                                                <rect x="860" y="60" width="46" height="24" rx="12" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="2" />
                                                <text x="883" y="76" fontWeight="900" fontSize="12" fill="#FFFFFF" textAnchor="middle">PRO</text>
                                            </g>

                                            <g className="reveal-3">
                                                <text x="60" y="230" fontWeight="900" fontSize="64" fill="#1A1A1A" letterSpacing="-2">Hacemos que</text>
                                                <circle cx="480" cy="210" r="10" fill="#00D68F" stroke="#1A1A1A" strokeWidth="2" />
                                            </g>

                                            <g className="reveal-4">
                                                <g transform="rotate(-2 190 280)">
                                                    <rect x="50" y="245" width="280" height="70" fill="#00D68F" stroke="#1A1A1A" strokeWidth="4" className="mint-highlight" />
                                                </g>
                                                <text x="60" y="300" fontWeight="900" fontSize="64" fill="#1A1A1A" letterSpacing="-2">tu marca</text>
                                            </g>

                                            <g className="reveal-5">
                                                <text x="60" y="370" fontWeight="900" fontSize="64" fill="#1A1A1A" letterSpacing="-2">destaque hoy<tspan fill="#8523E1">.</tspan></text>
                                                <path d="M60 385 Q 120 405, 180 385 T 300 385 T 450 385" fill="none" stroke="#FF6B6B" strokeWidth="6" strokeLinecap="round" />
                                                <rect x="470" y="315" width="8" height="60" fill="#1A1A1A" className="blink" />
                                            </g>

                                            <g className="reveal-6" style={{ transformOrigin: '180px 470px' }}>
                                                <rect x="66" y="446" width="240" height="64" fill="#1A1A1A" />
                                                <g className="btn-press">
                                                    <rect x="60" y="440" width="240" height="64" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />
                                                    <text x="180" y="482" fontWeight="900" fontSize="20" fill="#FFFFFF" textAnchor="middle">Empezar ahora →</text>
                                                </g>
                                                <g style={{ transformOrigin: '180px 472px' }}>
                                                    <circle cx="180" cy="472" r="10" fill="none" stroke="#8523E1" className="ring-burst" />
                                                    <g className="starburst-anim" style={{ transformOrigin: '180px 472px' }}>
                                                        <path d="M180 390 L195 450 L255 440 L205 475 L230 530 L180 490 L130 530 L155 475 L105 440 L165 450 Z" fill="#FFD93D" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round" />
                                                        <circle cx="110" cy="400" r="10" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="3" />
                                                        <circle cx="260" cy="390" r="8" fill="#00D68F" stroke="#1A1A1A" strokeWidth="3" />
                                                        <circle cx="250" cy="550" r="12" fill="#4D96FF" stroke="#1A1A1A" strokeWidth="3" />
                                                        <rect x="90" y="510" width="16" height="16" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" transform="rotate(20 98 518)" />
                                                    </g>
                                                </g>
                                            </g>

                                            <g className="reveal-7">
                                                <g className="float" style={{ transformOrigin: '750px 300px' }}>
                                                    <rect x="576" y="166" width="360" height="280" fill="#1A1A1A" transform="rotate(4 750 300)" />
                                                    <rect x="570" y="160" width="360" height="280" fill="#00D68F" stroke="#1A1A1A" strokeWidth="4" transform="rotate(4 750 300)" />
                                                    <circle cx="880" cy="200" r="60" fill="#8523E1" stroke="#1A1A1A" strokeWidth="4" />

                                                    <rect x="520" y="220" width="300" height="200" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4" />
                                                    <rect x="520" y="220" width="300" height="30" fill="#E5E5E5" strokeWidth="0" />
                                                    <line x1="520" y1="250" x2="820" y2="250" stroke="#1A1A1A" strokeWidth="4" />
                                                    <circle cx="540" cy="235" r="5" fill="#1A1A1A" />
                                                    <circle cx="555" cy="235" r="5" fill="#1A1A1A" />

                                                    <rect x="550" y="360" width="30" height="40" fill="#4D96FF" stroke="#1A1A1A" strokeWidth="2" className="bar-grow" style={{ transformOrigin: '550px 400px' }} />
                                                    <rect x="600" y="320" width="30" height="80" fill="#FFD93D" stroke="#1A1A1A" strokeWidth="2" className="bar-grow" style={{ transformOrigin: '600px 400px', animationDelay: '0.2s' }} />
                                                    <rect x="650" y="280" width="30" height="120" fill="#FF6B6B" stroke="#1A1A1A" strokeWidth="2" className="bar-grow" style={{ transformOrigin: '650px 400px', animationDelay: '0.4s' }} />
                                                    <rect x="700" y="340" width="30" height="60" fill="#8523E1" stroke="#1A1A1A" strokeWidth="2" className="bar-grow" style={{ transformOrigin: '700px 400px', animationDelay: '0.1s' }} />
                                                    <line x1="540" y1="400" x2="750" y2="400" stroke="#1A1A1A" strokeWidth="4" />

                                                    <g transform="translate(800, 360) rotate(-15)">
                                                        <polygon points="0,-25 15,-10 35,-15 25,5 40,20 20,25 15,45 0,30 -15,45 -20,25 -40,20 -25,5 -35,-15 -15,-10" fill="#FFD93D" stroke="#1A1A1A" strokeWidth="3" />
                                                        <text x="0" y="6" fontWeight="900" fontSize="16" fill="#1A1A1A" textAnchor="middle">100%</text>
                                                    </g>
                                                </g>
                                            </g>

                                            <g className="reveal-8">
                                                <rect x="66" y="556" width="270" height="150" fill="#1A1A1A" />
                                                <rect x="60" y="550" width="270" height="150" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4" />
                                                <rect x="60" y="550" width="270" height="40" fill="#FFD93D" />
                                                <line x1="60" y1="590" x2="330" y2="590" stroke="#1A1A1A" strokeWidth="4" />
                                                <text x="195" y="577" fontWeight="900" fontSize="18" fill="#1A1A1A" textAnchor="middle">Estrategia</text>
                                                <path d="M 90 670 L 130 640 L 160 650 L 210 610" fill="none" stroke="#4D96FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="draw-path" />
                                                <polygon points="200,610 220,600 215,620" fill="#4D96FF" stroke="#1A1A1A" strokeWidth="2" />
                                                <line x1="80" y1="610" x2="80" y2="680" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
                                                <line x1="80" y1="680" x2="230" y2="680" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
                                            </g>

                                            <g className="reveal-9">
                                                <rect x="366" y="556" width="270" height="150" fill="#1A1A1A" />
                                                <rect x="360" y="550" width="270" height="150" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4" />
                                                <rect x="360" y="550" width="270" height="40" fill="#00D68F" />
                                                <line x1="360" y1="590" x2="630" y2="590" stroke="#1A1A1A" strokeWidth="4" />
                                                <text x="495" y="577" fontWeight="900" fontSize="18" fill="#1A1A1A" textAnchor="middle">Diseño UI</text>
                                                <rect x="390" y="615" width="40" height="20" rx="10" fill="#E5E5E5" stroke="#1A1A1A" strokeWidth="3" />
                                                <circle cx="400" cy="625" r="6" fill="#1A1A1A" className="toggle-slide" />
                                                <rect x="445" y="620" width="140" height="10" fill="#E5E5E5" stroke="#1A1A1A" strokeWidth="2" />
                                                <rect x="390" y="655" width="40" height="20" rx="10" fill="#8523E1" stroke="#1A1A1A" strokeWidth="3" />
                                                <circle cx="420" cy="665" r="6" fill="#FFFFFF" />
                                                <rect x="445" y="660" width="100" height="10" fill="#E5E5E5" stroke="#1A1A1A" strokeWidth="2" />
                                            </g>

                                            <g className="reveal-8" style={{ animationDelay: '0.1s' }}>
                                                <rect x="666" y="556" width="270" height="150" fill="#1A1A1A" />
                                                <rect x="660" y="550" width="270" height="150" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4" />
                                                <rect x="660" y="550" width="270" height="40" fill="#FF6B6B" />
                                                <line x1="660" y1="590" x2="930" y2="590" stroke="#1A1A1A" strokeWidth="4" />
                                                <text x="795" y="577" fontWeight="900" fontSize="18" fill="#1A1A1A" textAnchor="middle">Desarrollo</text>
                                                <text x="690" y="625" fontWeight="700" fontSize="12" fill="#1A1A1A">Compilando...</text>
                                                <rect x="690" y="640" width="210" height="16" rx="8" fill="#E5E5E5" stroke="#1A1A1A" strokeWidth="3" />
                                                <rect x="690" y="640" width="0" height="16" rx="8" fill="#FFD93D" stroke="#1A1A1A" strokeWidth="3" className="progress-fill" />
                                            </g>

                                            <g className="cursor-anim">
                                                <path d="M 12 12 L 32 42 L 38 28 L 52 22 Z" fill="#1A1A1A" />
                                                <path d="M 0 0 L 20 30 L 26 16 L 40 10 Z" fill="#1A1A1A" stroke="#FFFFFF" strokeWidth="3" strokeLinejoin="round" />
                                            </g>
                                        </g>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
