"use client";

import { useEffect, useImperativeHandle, forwardRef, useRef } from "react";

interface FormData {
  companyName: string;
  name: string;
  registrationNumber: string;
  croppedImage: string | null;
}

interface PosterCanvasProps {
  formData: FormData;
}

export const PosterCanvas = forwardRef<HTMLCanvasElement, PosterCanvasProps>(
  ({ formData }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current!, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      
      canvas.width = 1080;
      canvas.height = 1080;

      const drawPoster = () => {
        const templateImg = new Image();
        templateImg.crossOrigin = "anonymous";

        templateImg.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          
          ctx.fillStyle = "#FFD700";
          ctx.font = 'bold 56px "Georama", Georgia, serif';
          ctx.fillText(
            formData.companyName.toUpperCase(),
            canvas.width / 2,
            485
          );

          
          const drawTextElements = () => {
            ctx.fillStyle = "#000000";
            ctx.font = 'bold 44px "Arvo", serif';
            ctx.fillText(formData.name.toUpperCase(), canvas.width / 2, 980);

            
            ctx.font = '32px "Oswald", sans-serif';
            ctx.fillText(
              formData.registrationNumber.toUpperCase(),
              canvas.width / 2,
              1020
            );
          };

          
          if (formData.croppedImage) {
            const userImg = new Image();
            userImg.crossOrigin = "anonymous";
            userImg.onload = () => {
              const photoSize = 395;
              const photoX = (canvas.width - photoSize) / 2;
              const photoY = 542;

              ctx.save();
              ctx.beginPath();
              ctx.arc(
                photoX + photoSize / 2,
                photoY + photoSize / 2,
                photoSize / 2,
                0,
                Math.PI * 2,
                true
              );
              ctx.closePath();
              ctx.clip();

              ctx.drawImage(userImg, photoX, photoY, photoSize, photoSize);
              ctx.restore();

              drawTextElements();
            };
            userImg.src = formData.croppedImage;
          } else {
            drawTextElements();
          }
        };
        
        templateImg.src = "/template.png";
      };


      Promise.all([
        document.fonts.load('bold 56px "Georama"'),
        document.fonts.load('bold 44px "Arvo"'),
        document.fonts.load('32px "Oswald"'),
      ]).then(drawPoster);
    }, [formData]);

    return (
      <div className="flex justify-center w-full">
        <canvas
          ref={canvasRef}
          className="border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-full h-auto shadow-2xl bg-white"
        />
      </div>
    );
  }
);

PosterCanvas.displayName = "PosterCanvas";
