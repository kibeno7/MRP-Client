"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Check, X, Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom] = useState(3);

  const [isDragging, setIsDragging] = useState(false);
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);

  
  const CANVAS_SIZE = 600;
  const CROP_RADIUS = 180;


  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  const clampOffset = useCallback(
    (rawOffset: { x: number; y: number }) => {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      if (!img || !canvas) return rawOffset;

      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width; 
      const ch = canvas.height;

      
      const scaledWidth = img.width * zoom;
      const scaledHeight = img.height * zoom;

      
      const scale = Math.min(cw, ch) / CANVAS_SIZE;
      const circleRadius = CROP_RADIUS * scale;

      
      const halfW = scaledWidth / 2;
      const halfH = scaledHeight / 2;

      const maxOffsetX = (halfW - circleRadius) / zoom;
      const maxOffsetY = (halfH - circleRadius) / zoom;

      
      const clampedX =
        halfW > circleRadius
          ? Math.min(Math.max(rawOffset.x, -maxOffsetX), maxOffsetX)
          : rawOffset.x;

      const clampedY =
        halfH > circleRadius
          ? Math.min(Math.max(rawOffset.y, -maxOffsetY), maxOffsetY)
          : rawOffset.y;

      return { x: clampedX, y: clampedY };
    },
    [zoom, CROP_RADIUS, CANVAS_SIZE]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    
    ctx.save();
    ctx.translate(cw / 2, ch / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x, offset.y);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, cw, ch);

    
    ctx.globalCompositeOperation = "destination-out";

   
    const scale = Math.min(cw, ch) / CANVAS_SIZE;
    const radius = CROP_RADIUS * scale;

    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }, [offset, zoom, CANVAS_SIZE, CROP_RADIUS]);

  
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      imageRef.current = img;

      const canvas = canvasRef.current;
      if (!canvas) return;

      syncCanvasSize();

      const cw = canvas.width;
      const ch = canvas.height;

      const scale = Math.min(cw, ch) / CANVAS_SIZE;
      const radius = CROP_RADIUS * scale;

      const minZoomW = (radius * 2) / img.width;
      const minZoomH = (radius * 2) / img.height;
      const computedMinZoom = Math.max(minZoomW, minZoomH);

      
      const startZoom = Math.max(computedMinZoom * 1.05, 1);

      setMinZoom(computedMinZoom);
      setZoom(startZoom);
      setOffset({ x: 0, y: 0 });
    };

    return () => {
      imageRef.current = null;
    };
  }, [image, syncCanvasSize, CANVAS_SIZE, CROP_RADIUS]);

 
  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize();
      draw();
    };

    syncCanvasSize();
    draw();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [syncCanvasSize, draw, zoom, offset]);

  
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !lastPointerPosition.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = e.clientX - lastPointerPosition.current.x;
    const dy = e.clientY - lastPointerPosition.current.y;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };

    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const scaleX = canvas.width / dpr / bounds.width;
    const scaleY = canvas.height / dpr / bounds.height;

    const newOffset = {
      x: offset.x + (dx * scaleX) / zoom,
      y: offset.y + (dy * scaleY) / zoom,
    };

    setOffset(clampOffset(newOffset));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    lastPointerPosition.current = null;
  };

  
  const handleZoomChange = (val: number[]) => {
    const newZoom = Math.min(Math.max(val[0], minZoom), maxZoom);
    setZoom(newZoom);
    
    setOffset((prev) => clampOffset(prev));
  };

  const handleCrop = () => {
    const img = imageRef.current;
    const previewCanvas = canvasRef.current;
    if (!img || !previewCanvas) return;

    const outputSize = CROP_RADIUS * 2;
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputSize, outputSize);

    
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    
    const cw = previewCanvas.width;
    const ch = previewCanvas.height;
    const scale = Math.min(cw, ch) / CANVAS_SIZE;
    const radiusOnPreview = CROP_RADIUS * scale;

    
    const ratio = outputSize / 2 / radiusOnPreview;

    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.scale(zoom * ratio, zoom * ratio);
    ctx.translate(offset.x, offset.y);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    onCropComplete(outputCanvas.toDataURL("image/png", 1.0));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Canvas Area */}
      <div className="relative w-full max-w-[450px] mx-auto aspect-square bg-neutral-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
        <canvas
          ref={canvasRef}
          className={cn(
            "w-full h-full touch-none select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none opacity-80 transition-opacity group-hover:opacity-100">
          <div className="bg-black/70 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-white/10">
            <Move className="w-3 h-3" />
            <span>Drag to reposition</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6 px-2">
        <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-xl border border-border/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ZoomIn className="w-4 h-4" /> Zoom
            </span>
            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
              {Math.round((zoom / (minZoom || 1)) * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={handleZoomChange}
              min={minZoom}
              max={maxZoom}
              step={0.01}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-150 active:scale-95"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleCrop}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-150 active:scale-95"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply crop
          </Button>
        </div>
      </div>
    </div>
  );
}
