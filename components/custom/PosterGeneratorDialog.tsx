"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, RefreshCw, Wand2 } from "lucide-react";
import { useState, useRef } from "react";
import { ImageCropper } from "./image-cropper";
import { PosterCanvas } from "./poster-canvas";

interface PosterGeneratorProps {
  interview: {
    interviewee: {
      name: string;
      reg_no: string;
    };
    company: string;
  };
}

export default function PosterGeneratorDialog({
  interview,
}: PosterGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "crop" | "preview">("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setStep("crop");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `${interview.interviewee.name}-${interview.company}-Poster.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  // Reset Logic
  const resetFlow = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setStep("upload");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wand2 className="h-4 w-4" /> Generate
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Generate Success Poster</DialogTitle>
          <DialogDescription>
            Create a social media poster for {interview.interviewee.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center min-h-[400px] justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6">
          {/* STEP 1: UPLOAD */}
          {step === "upload" && (
            <div className="text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-fit mx-auto">
                <Upload className="h-8 w-8 text-zinc-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upload Student Photo</h3>
                <p className="text-sm text-zinc-500">
                  Select a high-quality portrait image.
                </p>
              </div>
              <div className="relative">
                <Button>Select Image</Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 2: CROP */}
          {step === "crop" && selectedImage && (
            <div className="w-full">
              <ImageCropper
                image={selectedImage}
                onCropComplete={(cropped) => {
                  setCroppedImage(cropped);
                  setStep("preview");
                }}
                onCancel={resetFlow}
              />
            </div>
          )}

          {/* STEP 3: PREVIEW */}
          {step === "preview" && croppedImage && (
            <div className="w-full flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-full max-w-lg shadow-2xl rounded-lg overflow-hidden">
                <PosterCanvas
                  ref={canvasRef}
                  formData={{
                    companyName: interview.company,
                    name: interview.interviewee.name,
                    registrationNumber: interview.interviewee.reg_no,
                    croppedImage: croppedImage,
                  }}
                />
              </div>

              <div className="flex gap-4 w-full max-w-lg">
                <Button
                  variant="outline"
                  onClick={resetFlow}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                </Button>
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download Poster
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
