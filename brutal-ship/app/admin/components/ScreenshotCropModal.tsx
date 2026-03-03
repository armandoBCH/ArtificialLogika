"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ScreenshotCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (imageUrl: string) => void;
    externalUrl: string;
    projectTitle: string;
}

interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

type ModalStep = "idle" | "capturing" | "cropping" | "uploading" | "done" | "error";

export default function ScreenshotCropModal({
    isOpen,
    onClose,
    onComplete,
    externalUrl,
    projectTitle,
}: ScreenshotCropModalProps) {
    const [step, setStep] = useState<ModalStep>("idle");
    const [screenshotSrc, setScreenshotSrc] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState("");
    const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset on open/close
    useEffect(() => {
        if (isOpen) {
            setStep("idle");
            setScreenshotSrc("");
            setErrorMsg("");
            setCrop({ x: 0, y: 0, width: 0, height: 0 });
        }
    }, [isOpen]);

    // Auto-capture on open
    useEffect(() => {
        if (isOpen && externalUrl && step === "idle") {
            captureScreenshot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, externalUrl]);

    const captureScreenshot = async () => {
        setStep("capturing");
        setErrorMsg("");
        try {
            const res = await fetch("/api/admin/screenshot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: externalUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al capturar");
            setScreenshotSrc(data.image);
            // Set default crop to full image
            setCrop({ x: 0, y: 0, width: data.width, height: data.height });
            setStep("cropping");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
            setStep("error");
        }
    };

    const handleImageLoad = useCallback(() => {
        if (imgRef.current) {
            setImgDimensions({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight,
            });
            // Default crop: full image with 4:3 aspect ratio centered
            const w = imgRef.current.naturalWidth;
            const h = imgRef.current.naturalHeight;
            const targetRatio = 4 / 3;
            let cropW = w;
            let cropH = w / targetRatio;
            if (cropH > h) {
                cropH = h;
                cropW = h * targetRatio;
            }
            setCrop({
                x: Math.floor((w - cropW) / 2),
                y: Math.floor((h - cropH) / 2),
                width: Math.floor(cropW),
                height: Math.floor(cropH),
            });
        }
    }, []);

    // Get the display scale factor (image is displayed smaller than its natural size)
    const getScale = () => {
        if (!imgRef.current || !containerRef.current) return 1;
        return imgRef.current.clientWidth / imgRef.current.naturalWidth;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (step !== "cropping") return;
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const scale = getScale();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        setIsDragging(true);
        setDragStart({ x, y });
        setCrop({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || step !== "cropping") return;
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const scale = getScale();
        const currentX = Math.max(0, Math.min((e.clientX - rect.left) / scale, imgDimensions.width));
        const currentY = Math.max(0, Math.min((e.clientY - rect.top) / scale, imgDimensions.height));

        const x = Math.min(dragStart.x, currentX);
        const y = Math.min(dragStart.y, currentY);
        const width = Math.abs(currentX - dragStart.x);
        const height = Math.abs(currentY - dragStart.y);

        setCrop({ x: Math.floor(x), y: Math.floor(y), width: Math.floor(width), height: Math.floor(height) });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const performCropAndUpload = async () => {
        if (!screenshotSrc || crop.width < 10 || crop.height < 10) return;

        setStep("uploading");

        try {
            // Create canvas and draw cropped region
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Canvas no disponible");

            const img = new Image();
            img.crossOrigin = "anonymous";

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error("Error al cargar imagen"));
                img.src = screenshotSrc;
            });

            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context no disponible");

            ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

            // Convert to base64
            const croppedBase64 = canvas.toDataURL("image/png");

            // Generate filename from project title
            const safeName = (projectTitle || "screenshot")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 50);
            const timestamp = Date.now();
            const filename = `${safeName}-${timestamp}.png`;

            // Upload to Supabase
            const uploadRes = await fetch("/api/admin/upload-supabase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: croppedBase64, filename }),
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || "Error al subir");

            setStep("done");
            onComplete(uploadData.url);
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
            setStep("error");
        }
    };

    if (!isOpen) return null;

    const scale = getScale();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e1530] border-2 border-primary/40 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-auto shadow-[8px_8px_0px_rgba(0,0,0,0.3)]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-black text-white font-display flex items-center gap-2">
                            📸 Captura de Screenshot
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{externalUrl}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Step: Capturing */}
                    {step === "capturing" && (
                        <div className="text-center py-16 space-y-4">
                            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-white font-bold text-lg">Capturando screenshot...</p>
                            <p className="text-gray-400 text-sm">Esperando 3 segundos para que cargue completamente</p>
                        </div>
                    )}

                    {/* Step: Error */}
                    {step === "error" && (
                        <div className="text-center py-12 space-y-4">
                            <span className="text-4xl">❌</span>
                            <p className="text-hot-coral font-bold text-lg">{errorMsg}</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={captureScreenshot}
                                    className="bg-primary text-white font-bold px-5 py-2 border-2 border-black rounded-sm shadow-neobrutalism-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                                >
                                    🔄 Reintentar
                                </button>
                                <button onClick={onClose} className="text-gray-400 font-bold px-4 py-2 hover:text-white transition-colors">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step: Cropping */}
                    {step === "cropping" && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    <span className="text-mint font-bold">Arrastrá</span> sobre la imagen para seleccionar el área de recorte
                                </p>
                                {crop.width > 10 && crop.height > 10 && (
                                    <span className="text-xs text-gray-500 font-mono">
                                        {crop.width}×{crop.height}px
                                    </span>
                                )}
                            </div>

                            <div
                                ref={containerRef}
                                className="relative border-2 border-white/20 rounded-sm overflow-hidden cursor-crosshair select-none bg-black"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={imgRef}
                                    src={screenshotSrc}
                                    alt="Screenshot capturado"
                                    className="w-full h-auto block"
                                    onLoad={handleImageLoad}
                                    draggable={false}
                                />

                                {/* Crop overlay — darkens area outside selection */}
                                {crop.width > 5 && crop.height > 5 && (
                                    <>
                                        {/* Dark overlay on the entire image */}
                                        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                                        {/* Clear cutout for the crop area */}
                                        <div
                                            className="absolute border-2 border-mint pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                                            style={{
                                                left: `${crop.x * scale}px`,
                                                top: `${crop.y * scale}px`,
                                                width: `${crop.width * scale}px`,
                                                height: `${crop.height * scale}px`,
                                                background: "transparent",
                                            }}
                                        >
                                            {/* Corner handles */}
                                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-mint border border-black" />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-mint border border-black" />
                                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-mint border border-black" />
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-mint border border-black" />
                                            {/* Dimension label */}
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-mint font-mono whitespace-nowrap">
                                                {crop.width}×{crop.height}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={performCropAndUpload}
                                    disabled={crop.width < 10 || crop.height < 10}
                                    className="bg-mint text-black font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    ✂️ Recortar y Subir
                                </button>
                                <button
                                    onClick={captureScreenshot}
                                    className="bg-white/10 text-white font-bold px-5 py-2 border-2 border-white/20 rounded-sm hover:bg-white/20 transition-all"
                                >
                                    🔄 Recapturar
                                </button>
                                <button onClick={onClose} className="text-gray-400 font-bold px-4 py-2 hover:text-white transition-colors ml-auto">
                                    Cancelar
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step: Uploading */}
                    {step === "uploading" && (
                        <div className="text-center py-16 space-y-4">
                            <div className="inline-block w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin" />
                            <p className="text-white font-bold text-lg">Recortando y subiendo a Supabase...</p>
                            <p className="text-gray-400 text-sm">Esto puede tomar unos segundos</p>
                        </div>
                    )}

                    {/* Step: Done */}
                    {step === "done" && (
                        <div className="text-center py-12 space-y-4">
                            <span className="text-4xl">✅</span>
                            <p className="text-mint font-bold text-lg">¡Screenshot subido exitosamente!</p>
                            <p className="text-gray-400 text-sm">La URL se copió al campo de imagen automáticamente.</p>
                            <button
                                onClick={onClose}
                                className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>

                {/* Hidden canvas for crop processing */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
