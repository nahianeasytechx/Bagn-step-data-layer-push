"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, SquarePen } from "lucide-react";
import type { Product } from "@/types/types";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

/**
 * Props for EditProductDialog
 */
export interface EditProductDialogProps {
  product: Product;
  /** optional callback fired after a successful update */
  onUpdated?: () => void;
}

/**
 * A self‑contained dialog for editing a single product.
 * Usage:
 *   <EditProductDialog product={item} onUpdated={refetchProducts} />
 */
export default function EditProductDialog({ product, onUpdated }: EditProductDialogProps) {
  /* ────────────────────────────────────────────
   * State initialised from props
   * ───────────────────────────────────────────*/
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [discountPrice, setDiscountPrice] = useState(String(product.discountPrice));
  const [description, setDescription] = useState(product.description)
  const [sizes, setSizes] = useState<{ size: string; stock: string }[]>(
    product.sizes.map((s) => ({ size: s.size, stock: String(s.stock) }))
  );
  const [existingImages, setExistingImages] = useState<string[]>(product.images);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);



  /* ────────────────────────────────────────────
   * Derived helpers
   * ───────────────────────────────────────────*/
  const totalStock = useMemo(
    () => sizes.reduce((sum, s) => sum + Number.parseInt(s.stock || "0", 10), 0),
    [sizes]
  );

  /* ────────────────────────────────────────────
   * Size utilities
   * ───────────────────────────────────────────*/
  const updateSize = (index: number, field: "size" | "stock", value: string) => {
    setSizes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as any;
      return next;
    });
  };

  const addSize = () => setSizes((prev) => [...prev, { size: "", stock: "0" }]);
  const removeSize = (index: number) => setSizes((prev) => prev.filter((_, i) => i !== index));

  /* ────────────────────────────────────────────
   * Image utilities
   * ───────────────────────────────────────────*/

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;        // files: FileList | null
    if (!files) return;                  // guard → after this, files is FileList

    setNewImages(prev => [...prev, ...Array.from(files)]);
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ────────────────────────────────────────────
   * Cloudinary upload
   * ───────────────────────────────────────────*/
  const uploadNewImages = async (): Promise<string[]> => {
    if (newImages.length === 0) return [];

    setUploading(true);
    const uploaded: string[] = [];
    for (const image of newImages) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "productImages");
      formData.append("folder", "uploads");
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/da4l4bhhn/image/upload",
          formData
        );
        uploaded.push(res.data.secure_url);
      } catch (err) {
        console.error("Cloudinary upload failed", err);
      }
    }
    setUploading(false);
    return uploaded;
  };

  /* ────────────────────────────────────────────
   * Submit handler
   * ───────────────────────────────────────────*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // 1) Upload any new images
    const newUrls = await uploadNewImages();
    const images = [...existingImages, ...newUrls];

    // 2) Prepare payload
    const payload = {
      name,
      price: Number.parseFloat(price),
      discountPrice : Number.parseFloat(discountPrice),
      description,
      images,
      removedImages,
      sizes: sizes.map((s) => ({ size: s.size, stock: Number.parseInt(s.stock, 10) })),
    };

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, payload);
      toast.success("Product updated successfully!");
      onUpdated?.();
    } catch (err) {
      console.error("Product update failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ────────────────────────────────────────────
   * Render
   * ───────────────────────────────────────────*/
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button  variant="ghost" size="icon">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto w-[90%] rounded-xl">
        <DialogHeader className="text-left mt-4">
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update details, images, and stock levels. Current total stock: {totalStock}
          </DialogDescription>
        </DialogHeader>

        {/* ─── Form ───────────────────────────────────────────────*/}
        <form onSubmit={handleSubmit} className="space-y-6 pb-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="font-medium">Price</label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/*Discount Price */}
          <div className="space-y-2">
            <label className="font-medium">Discount Price</label>
            <Input
              type="number"
              step="0.01"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Existing images */}
          <section className="space-y-2">
            <h4 className="font-medium">Images</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {existingImages.map((url) => (
                <div key={url} className="relative">
                  <Image
                    src={url}
                    alt="product"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute right-1 top-1 h-6 w-6 rounded-full p-0"
                    onClick={() => handleRemoveExistingImage(url)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Add / preview new images */}
          <section className="space-y-4">
            <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {newImages.map((file, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="new"
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute right-0 top-0 h-5 w-5 p-0"
                      onClick={() => handleRemoveNewImage(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Sizes */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Sizes</h4>
              <Button type="button" size="sm" onClick={addSize} variant="outline">
                + Add size
              </Button>
            </div>
            {sizes.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={s.size}
                  placeholder="Size"
                  onChange={(e) => updateSize(idx, "size", e.target.value)}
                />
                <Input
                  type="number"
                  value={s.stock}
                  placeholder="Stock"
                  onChange={(e) => updateSize(idx, "stock", e.target.value)}
                />
                <Button type="button" size="icon" variant="destructive" onClick={() => removeSize(idx)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </section>

          <Button type="submit" disabled={uploading || submitting} className="w-full">
            {uploading || submitting ? "Saving…" : "Update product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
