"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { FileUpload } from "../ui/file-upload";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface PosterGenerationProps {
  interviewId: string;
}

export default function PosterGeneration({
  interviewId,
}: PosterGenerationProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  // const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [crop, setCrop] = useState<Crop>();

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (uploadedFiles: File[]) => {
    if (uploadedFiles.length > 0) {
      const selectedFile = uploadedFiles[0];
      setFile(selectedFile);
      setFileUploaded(true);
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
    }
  };
  const onImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const { naturalWidth, naturalHeight } = image;
    const aspect = naturalWidth / naturalHeight;

    let width: number, height: number;
    if (aspect > 1) {
      height = 100;
      width = 100 / aspect;
    } else {
      width = 100;
      height = 100 * aspect;
    }

    setCrop({
      unit: "%",
      x: (100 - width) / 2,
      y: (100 - height) / 2,
      width,
      height,
    });
  };

  const generateCroppedImage = async (crop: PixelCrop) => {
    if (!crop.width || !crop.height || !imageRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob || !file) return resolve(null);
        const croppedFile = new File([blob], file.name || "cropped_image.jpg", {
          type: "image/jpeg",
        });
        resolve(croppedFile);
      }, "image/jpeg");
    });
  };

  const handleGeneratePoster = async () => {
    if (crop.width && crop.height) {
      const generatedFile = await generateCroppedImage(crop as PixelCrop);

      if (generatedFile) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("photo", generatedFile, generatedFile.name);
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/interview/${interviewId}/poster`,
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.status === "success") {
            console.log("Image sent to backend successfully");
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}${response.data.download}`;
            window.location.href = downloadUrl;
            setFile(null);
            setImageSrc(null);
            setCrop(undefined);
            setFileUploaded(false);
          } else {
            console.error(
              "Failed to send image to backend:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Error sending image to backend:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("Failed to generate cropped file.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-full p-6 rounded-lg w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Generate Poster</h1>
      {imageSrc && (
        <div className="mt-4 max-w-md pb-12">
          <div className="flex flex-col items-center">
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
              <Image
                src={imageSrc}
                alt="Uploaded image"
                width={400}
                height={400}
                className="max-w-full h-auto rounded-lg border border-gray-300"
                onLoad={onImageLoad}
                ref={imageRef}
              />
            </ReactCrop>
          </div>
          <Button
            onClick={handleGeneratePoster}
            className="mt-4 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" /> poster generating...
              </div>
            ) : (
              "Generate Poster"
            )}
          </Button>
        </div>
      )}
      <FileUpload onChange={handleFileChange} fileUploaded={fileUploaded} />

      {/* {croppedImageUrl && (
        <div className="mt-4 max-w-md pb-12">
          <h2 className="text-xl font-bold mb-2">Cropped Image Preview:</h2>
          <Image
            src={croppedImageUrl}
            alt="Cropped image"
            width={400}
            height={400}
            className="max-w-full h-auto rounded-lg border border-gray-300"
          />
        </div>
      )} */}
    </div>
  );
}
