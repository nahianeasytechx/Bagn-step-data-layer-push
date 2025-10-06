"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import Image from "next/image";

export default function EditProductModal({
  product,
  refresh,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sizes: { size: string; stock: number }[];
  };
  refresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [sizes, setSizes] = useState(product.sizes || []);
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (newImages.length === 0) return [];
    setUploading(true);
    const uploadedImageUrls: string[] = [];

    for (const image of newImages) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "productImages");
      formData.append("folder", "uploads");

      try {
        const response = await axios.post("https://api.cloudinary.com/v1_1/da4l4bhhn/image/upload", formData);
        uploadedImageUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
    return uploadedImageUrls;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((img) => img !== url));
    setRemovedImages([...removedImages, url]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const updateSize = (index: number, field: string, value: string | number) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setSizes(updatedSizes);
  };

  const addSize = () => setSizes([...sizes, { size: "", stock: 0 }]);
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = await handleImageUpload();
    const updatedImages = [...existingImages, ...imageUrls];

    await fetch(`${process.env.NEXT_PRIVATE_API_URL}/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        images: updatedImages,
        removedImages,
        sizes,
      }),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
    setOpen(false); // Close modal after save
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Product</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />

          {/* Existing Images */}
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <Image src={img} alt="Product" width={64} height={64} className="rounded" />
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  className="absolute top-0 right-0"
                  onClick={() => handleRemoveExistingImage(img)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          {/* New Images */}
          <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
          <div className="flex flex-wrap gap-2">
            {newImages.map((file, index) => (
              <div key={index} className="relative">
                <Image src={URL.createObjectURL(file)} alt="New Product" width={64} height={64} className="rounded" />
                <Button
                  type="button"
                  variant="destructive"
                  size={"lg"}
                  className="absolute top-0 right-0"
                  onClick={() => handleRemoveNewImage(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          {/* Sizes Section */}
          <div className="space-y-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={size.size}
                  onChange={(e) => updateSize(index, "size", e.target.value)}
                  placeholder="Size (e.g., US 9)"
                />
                <Input
                  type="number"
                  value={size.stock}
                  onChange={(e) => updateSize(index, "stock", Number(e.target.value))}
                  placeholder="Stock"
                />
                <Button type="button" variant="destructive" onClick={() => removeSize(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addSize}>
              Add Size
            </Button>
          </div>

          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Update Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
