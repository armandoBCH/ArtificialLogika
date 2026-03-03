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
type DragMode = "none" | "move" | "nw" | "ne" | "sw" | "se";

// Aspect ratio presets for portfolio cards
const ASPECT_PRESETS = [
    { label: "Tarjeta (16:10)", ratio: 16 / 10 },
    { label: "Cuadrado (1:1)", ratio: 1 },
    { label: "Panorámico (16:9)", ratio: 16 / 9 },
    { label: "Libre", ratio: 0 },
];

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
    const [dragMode, setDragMode] = useState<DragMode>("none");
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [cropAtDragStart, setCropAtDragStart] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
    const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
    const [lockedRatio, setLockedRatio] = useState<number>(16 / 10); // Default: card ratio
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setStep("idle");
            setScreenshotSrc("");
            setErrorMsg("");
            setCrop({ x: 0, y: 0, width: 0, height: 0 });
            setLockedRatio(16 / 10);
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
            setCrop({ x: 0, y: 0, width: data.width, height: data.height });
            setStep("cropping");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
            setStep("error");
        }
    };

    const handleImageLoad = useCallback(() => {
        if (imgRef.current) {
            const w = imgRef.current.naturalWidth;
            const h = imgRef.current.naturalHeight;
            setImgDimensions({ width: w, height: h });
            // Apply default 16:10 crop centered
            applyCropPreset(16 / 10, w, h);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyCropPreset = (ratio: number, imgW?: number, imgH?: number) => {
        const w = imgW || imgDimensions.width;
        const h = imgH || imgDimensions.height;
        if (!w || !h) return;

        setLockedRatio(ratio);

        if (ratio === 0) return; // Free mode, keep current crop

        let cropW = w;
        let cropH = w / ratio;
        if (cropH > h) {
            cropH = h;
            cropW = h * ratio;
        }
        // Make it 80% of max to leave room for adjustment
        cropW = Math.min(cropW * 0.85, w);
        cropH = cropW / ratio;
        if (cropH > h * 0.85) {
            cropH = h * 0.85;
            cropW = cropH * ratio;
        }

        setCrop({
            x: Math.floor((w - cropW) / 2),
            y: Math.floor((h - cropH) / 2),
            width: Math.floor(cropW),
            height: Math.floor(cropH),
        });
    };

    // Get the display scale factor
    const getScale = () => {
        if (!imgRef.current) return 1;
        return imgRef.current.clientWidth / imgRef.current.naturalWidth;
    };

    const getMousePos = (e: React.MouseEvent) => {
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        const scale = getScale();
        return {
            x: Math.max(0, Math.min((e.clientX - rect.left) / scale, imgDimensions.width)),
            y: Math.max(0, Math.min((e.clientY - rect.top) / scale, imgDimensions.height)),
        };
    };

    const handleMouseDown = (e: React.MouseEvent, mode: DragMode) => {
        if (step !== "cropping") return;
        e.preventDefault();
        e.stopPropagation();
        const pos = getMousePos(e);
        setDragMode(mode);
        setDragStart(pos);
        setCropAtDragStart({ ...crop });
    };

    const handleContainerMouseDown = (e: React.MouseEvent) => {
        if (step !== "cropping") return;
        const pos = getMousePos(e);
        // Check if clicking inside the crop area → move mode
        if (
            pos.x >= crop.x && pos.x <= crop.x + crop.width &&
            pos.y >= crop.y && pos.y <= crop.y + crop.height
        ) {
            handleMouseDown(e, "move");
        } else {
            // Clicking outside → start new crop
            setDragMode("se");
            setDragStart(pos);
            const newCrop = { x: pos.x, y: pos.y, width: 0, height: 0 };
            setCrop(newCrop);
            setCropAtDragStart(newCrop);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragMode === "none" || step !== "cropping") return;
        const pos = getMousePos(e);
        const dx = pos.x - dragStart.x;
        const dy = pos.y - dragStart.y;
        const iw = imgDimensions.width;
        const ih = imgDimensions.height;

        if (dragMode === "move") {
            // Move the entire crop box
            let nx = cropAtDragStart.x + dx;
            let ny = cropAtDragStart.y + dy;
            nx = Math.max(0, Math.min(nx, iw - cropAtDragStart.width));
            ny = Math.max(0, Math.min(ny, ih - cropAtDragStart.height));
            setCrop({ ...cropAtDragStart, x: Math.floor(nx), y: Math.floor(ny) });
        } else {
            // Resize from a corner
            let newX = cropAtDragStart.x;
            let newY = cropAtDragStart.y;
            let newW = cropAtDragStart.width;
            let newH = cropAtDragStart.height;

            if (dragMode === "se") {
                newW = Math.max(30, cropAtDragStart.width + dx);
                newH = lockedRatio > 0 ? newW / lockedRatio : Math.max(30, cropAtDragStart.height + dy);
            } else if (dragMode === "sw") {
                newW = Math.max(30, cropAtDragStart.width - dx);
                newH = lockedRatio > 0 ? newW / lockedRatio : Math.max(30, cropAtDragStart.height + dy);
                newX = cropAtDragStart.x + cropAtDragStart.width - newW;
            } else if (dragMode === "ne") {
                newW = Math.max(30, cropAtDragStart.width + dx);
                newH = lockedRatio > 0 ? newW / lockedRatio : Math.max(30, cropAtDragStart.height - dy);
                newY = cropAtDragStart.y + cropAtDragStart.height - newH;
            } else if (dragMode === "nw") {
                newW = Math.max(30, cropAtDragStart.width - dx);
                newH = lockedRatio > 0 ? newW / lockedRatio : Math.max(30, cropAtDragStart.height - dy);
                newX = cropAtDragStart.x + cropAtDragStart.width - newW;
                newY = cropAtDragStart.y + cropAtDragStart.height - newH;
            }

            // Clamp to image bounds
            newX = Math.max(0, newX);
            newY = Math.max(0, newY);
            newW = Math.min(newW, iw - newX);
            newH = Math.min(newH, ih - newY);

            setCrop({
                x: Math.floor(newX),
                y: Math.floor(newY),
                width: Math.floor(newW),
                height: Math.floor(newH),
            });
        }
    };

    const handleMouseUp = () => {
        setDragMode("none");
    };

    const performCropAndUpload = async () => {
        if (!screenshotSrc || crop.width < 10 || crop.height < 10) return;
        setStep("uploading");

        try {
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

            // Use WebP for best compression + quality balance
            const croppedBase64 = canvas.toDataURL("image/webp", 0.85);

            const safeName = (projectTitle || "screenshot")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 50);
            const filename = `${safeName}-${Date.now()}.webp`;

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
    const HANDLE_SIZE = 14;

    // Corner handle positions (in display pixels)
    const corners = crop.width > 10 && crop.height > 10 ? [
        { mode: "nw" as DragMode, style: { left: crop.x * scale - HANDLE_SIZE / 2, top: crop.y * scale - HANDLE_SIZE / 2, cursor: "nwse-resize" } },
        { mode: "ne" as DragMode, style: { left: (crop.x + crop.width) * scale - HANDLE_SIZE / 2, top: crop.y * scale - HANDLE_SIZE / 2, cursor: "nesw-resize" } },
        { mode: "sw" as DragMode, style: { left: crop.x * scale - HANDLE_SIZE / 2, top: (crop.y + crop.height) * scale - HANDLE_SIZE / 2, cursor: "nesw-resize" } },
        { mode: "se" as DragMode, style: { left: (crop.x + crop.width) * scale - HANDLE_SIZE / 2, top: (crop.y + crop.height) * scale - HANDLE_SIZE / 2, cursor: "nwse-resize" } },
    ] : [];

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
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-2xl leading-none">×</button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Capturing */}
                    {step === "capturing" && (
                        <div className="text-center py-16 space-y-4">
                            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-white font-bold text-lg">Capturando screenshot...</p>
                            <p className="text-gray-400 text-sm">Esperando a que cargue completamente</p>
                        </div>
                    )}

                    {/* Error */}
                    {step === "error" && (
                        <div className="text-center py-12 space-y-4">
                            <span className="text-4xl">❌</span>
                            <p className="text-hot-coral font-bold text-lg">{errorMsg}</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={captureScreenshot} className="bg-primary text-white font-bold px-5 py-2 border-2 border-black rounded-sm shadow-neobrutalism-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                    🔄 Reintentar
                                </button>
                                <button onClick={onClose} className="text-gray-400 font-bold px-4 py-2 hover:text-white transition-colors">Cancelar</button>
                            </div>
                        </div>
                    )}

                    {/* Cropping */}
                    {step === "cropping" && (
                        <>
                            {/* Aspect ratio presets */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex gap-2">
                                    {ASPECT_PRESETS.map((preset) => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => applyCropPreset(preset.ratio)}
                                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 rounded-sm transition-all ${lockedRatio === preset.ratio
                                                ? "bg-mint text-black border-black shadow-[2px_2px_0px_#000]"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                                }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                                {crop.width > 10 && crop.height > 10 && (
                                    <span className="text-xs text-gray-500 font-mono">
                                        {crop.width}×{crop.height}px
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-gray-400">
                                <span className="text-mint font-bold">Arrastrá las esquinas</span> para redimensionar ·
                                <span className="text-mint font-bold"> Arrastrá dentro</span> para mover
                            </p>

                            {/* Image + crop overlay */}
                            <div
                                className="relative border-2 border-white/20 rounded-sm overflow-hidden bg-black select-none"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onMouseDown={handleContainerMouseDown}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={imgRef}
                                    src={screenshotSrc}
                                    alt="Screenshot capturado"
                                    className="w-full h-auto block pointer-events-none"
                                    onLoad={handleImageLoad}
                                    draggable={false}
                                />

                                {/* Dark overlay outside crop */}
                                {crop.width > 5 && crop.height > 5 && (
                                    <>
                                        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                                        {/* Clear crop area */}
                                        <div
                                            className="absolute border-2 border-mint pointer-events-none"
                                            style={{
                                                left: `${crop.x * scale}px`,
                                                top: `${crop.y * scale}px`,
                                                width: `${crop.width * scale}px`,
                                                height: `${crop.height * scale}px`,
                                                boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
                                                background: "transparent",
                                            }}
                                        >
                                            {/* Rule of thirds grid */}
                                            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }}>
                                                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-mint" />
                                                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-mint" />
                                                <div className="absolute top-1/3 left-0 right-0 h-px bg-mint" />
                                                <div className="absolute top-2/3 left-0 right-0 h-px bg-mint" />
                                            </div>
                                            {/* Move cursor inside */}
                                            <div className="absolute inset-0 cursor-move" style={{ pointerEvents: "auto" }}
                                                onMouseDown={(e) => handleMouseDown(e, "move")}
                                            />
                                        </div>

                                        {/* Corner drag handles */}
                                        {corners.map((corner) => (
                                            <div
                                                key={corner.mode}
                                                className="absolute bg-mint border-2 border-black z-10"
                                                style={{
                                                    ...corner.style,
                                                    width: HANDLE_SIZE,
                                                    height: HANDLE_SIZE,
                                                    pointerEvents: "auto",
                                                }}
                                                onMouseDown={(e) => handleMouseDown(e, corner.mode)}
                                            />
                                        ))}

                                        {/* Size label */}
                                        <div
                                            className="absolute text-[10px] text-mint font-mono whitespace-nowrap pointer-events-none z-10"
                                            style={{
                                                left: `${(crop.x + crop.width / 2) * scale}px`,
                                                top: `${(crop.y + crop.height) * scale + 8}px`,
                                                transform: "translateX(-50%)",
                                            }}
                                        >
                                            {crop.width}×{crop.height}
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
                                <button onClick={onClose} className="text-gray-400 font-bold px-4 py-2 hover:text-white transition-colors ml-auto">Cancelar</button>
                            </div>
                        </>
                    )}

                    {/* Uploading */}
                    {step === "uploading" && (
                        <div className="text-center py-16 space-y-4">
                            <div className="inline-block w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin" />
                            <p className="text-white font-bold text-lg">Recortando y subiendo...</p>
                        </div>
                    )}

                    {/* Done */}
                    {step === "done" && (
                        <div className="text-center py-12 space-y-4">
                            <span className="text-4xl">✅</span>
                            <p className="text-mint font-bold text-lg">¡Screenshot subido exitosamente!</p>
                            <button onClick={onClose} className="bg-primary text-white font-bold px-6 py-2.5 border-2 border-black shadow-neobrutalism-sm rounded-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
