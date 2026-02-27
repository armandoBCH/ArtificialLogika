"use client";

import { useState } from 'react';

export default function WhatsAppChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = "5491112345678"; // Replace with actual number

    const handleSendMessage = (message: string) => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end">

            {/* Chat Window */}
            <div className={`bg-white border-2 border-black rounded-lg shadow-neobrutalism-lg w-80 mb-4 flex flex-col origin-bottom-right transition-all duration-300 ease-out absolute bottom-16 right-0 ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                }`}>
                {/* Header */}
                <div className="bg-[#25D366] text-white p-4 border-b-2 border-black flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                            <span className="material-icons text-black text-2xl">support_agent</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg leading-tight">Artificial Logika</h4>
                            <p className="text-xs text-white/90 font-medium">En línea</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-black transition-colors"
                        aria-label="Cerrar chat"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Chat Body */}
                <div className="p-4 bg-[url('https://lelogama.go-fastly.net/file/showcase-images/whatsapp-chat-bg.png')] bg-cover bg-center flex flex-col gap-3 min-h-[320px]">
                    {/* Welcome Message */}
                    <div className="bg-white border-2 border-black rounded-lg rounded-tl-none p-3 shadow-[2px_2px_0px_#000] self-start max-w-[85%] relative">
                        <p className="text-sm font-medium">¡Hola! 👋 Bienvenido a Artificial Logika.</p>
                        <p className="text-sm font-medium mt-1">¿En qué te podemos ayudar hoy? Presioná una opción abajo:</p>
                    </div>

                    {/* Options Buttons (acting as user messages) */}
                    <div className="flex flex-col gap-2 mt-2 w-full">
                        <button
                            onClick={() => handleSendMessage("Hola, me interesa empezar mi página web con el Plan Landing.")}
                            className="bg-[#E8F5E9] border-2 border-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-black text-black text-sm font-bold py-2 px-3 rounded-lg shadow-neobrutalism-sm hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-left"
                        >
                            🚀 Quiero una Landing Page
                        </button>
                        <button
                            onClick={() => handleSendMessage("Hola, me interesa armar mi tienda online (E-commerce).")}
                            className="bg-[#E8F5E9] border-2 border-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-black text-black text-sm font-bold py-2 px-3 rounded-lg shadow-neobrutalism-sm hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-left"
                        >
                            🛒 Quiero un E-commerce
                        </button>
                        <button
                            onClick={() => handleSendMessage("Hola, necesito un sitio web institucional completo.")}
                            className="bg-[#E8F5E9] border-2 border-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-black text-black text-sm font-bold py-2 px-3 rounded-lg shadow-neobrutalism-sm hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-left"
                        >
                            🏢 Quiero un Sitio Institucional
                        </button>
                        <button
                            onClick={() => handleSendMessage("Hola, tengo una consulta sobre los precios/servicios.")}
                            className="bg-white border-2 border-black hover:bg-black hover:text-white text-black text-sm font-bold py-2 px-3 rounded-lg shadow-neobrutalism-sm hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all text-left"
                        >
                            ❓ Tengo otra consulta
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button (replaces the old a tag) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full border-2 border-black shadow-neobrutalism transition-all z-50 ${isOpen ? 'scale-90 shadow-none translate-x-[2px] translate-y-[2px]' : 'hover:shadow-neobrutalism-sm hover:translate-x-[2px] hover:translate-y-[2px]'
                    }`}
                aria-label={isOpen ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
            >
                {isOpen ? (
                    <span className="material-icons text-3xl">close</span>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
