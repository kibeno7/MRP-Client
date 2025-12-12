"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Upload,
  RefreshCw,
  Wand2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { ImageCropper } from "@/components/custom/image-cropper";
import { PosterCanvas } from "@/components/custom/poster-canvas";
import { motion } from "framer-motion";

export default function GeneratePosterPage() {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [company, setCompany] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      const safeName =
        name.trim().split(" ")[0] + "_" + name.trim().split(" ")[1] ||
        "Student";
      link.download = `${safeName}_placement_poster.png`;
      link.href = canvasRef.current.toDataURL("image/png", 1.0);
      link.click();
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setIsCropping(false);
  };

  const isFormValid = name && regNo && company && croppedImage;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- Header --- */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Poster Generator
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manually create success posters for placement achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- LEFT COLUMN: Inputs --- */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
                <CardDescription>
                  Enter the information to display on the poster.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Adarsh Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regNo">Registration Number</Label>
                  <Input
                    id="regNo"
                    placeholder="e.g. 2022PGCACA045"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    className="bg-zinc-50 dark:bg-zinc-900 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Microsoft"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-900"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
              <CardHeader>
                <CardTitle>Student Photo</CardTitle>
                <CardDescription>
                  Upload a high-quality portrait.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!croppedImage ? (
                  <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <Upload className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">
                        Click to upload image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square w-32 mx-auto rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={croppedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Change Photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: Preview --- */}
          <div className="lg:col-span-2">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    Real-time rendering of the final poster.
                  </CardDescription>
                </div>
                <Button
                  onClick={handleDownload}
                  disabled={!isFormValid}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Poster
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-8 bg-zinc-100/50 dark:bg-zinc-900/50">
                {isFormValid ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="shadow-2xl rounded-lg overflow-hidden max-w-full"
                  >
                    <PosterCanvas
                      ref={canvasRef}
                      formData={{
                        name: name || "Student Name",
                        registrationNumber: regNo || "REGISTRATION NO",
                        companyName: company || "COMPANY NAME",
                        croppedImage: croppedImage,
                      }}
                    />
                  </motion.div>
                ) : (
                  <div className="text-center text-zinc-400 space-y-3">
                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-full w-fit mx-auto shadow-sm">
                      <ImageIcon className="h-8 w-8 opacity-50" />
                    </div>
                    <p>
                      Fill in all details and upload an image to generate the
                      poster.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- CROPPER DIALOG --- */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedImage && (
              <ImageCropper
                image={selectedImage}
                onCancel={handleReset}
                onCropComplete={(cropped) => {
                  setCroppedImage(cropped);
                  setIsCropping(false);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
