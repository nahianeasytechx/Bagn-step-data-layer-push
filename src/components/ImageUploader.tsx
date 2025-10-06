"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";

type UploadedImage = {
  file: File;
  preview: string;
};

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  resetTrigger: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected , resetTrigger }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    onImagesSelected([...images.map((img) => img.file), ...acceptedFiles]); // Send selected images to parent
  }, [images, onImagesSelected]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesSelected(newImages.map((img) => img.file)); // Update parent
  };

    // Reset images when resetTrigger changes
    useEffect(() => {
      if (resetTrigger) {
        setImages([]); // Clear the images state
      }
    }, [resetTrigger]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    multiple: true,
  });

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">Drag & drop images here, or click to browse</p>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-5 mt-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <Image
                width={100}
                height={100}
                  src={img.preview}
                  alt={`Preview ${index}`}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-white text-xs px-1.5 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImageUploader;
