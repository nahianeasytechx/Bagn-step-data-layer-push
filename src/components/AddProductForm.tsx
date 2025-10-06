"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import { toast } from "sonner";

export default function AddProductForm() {
  const [name, setName] = useState("");
  const [productCode, setProductCode] = useState(""); // ✅ New state
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([
    { size: "39", stock: "" },
    { size: "40", stock: "" },
    { size: "41", stock: "" },
    { size: "42", stock: "" },
    { size: "43", stock: "" },
    { size: "44", stock: "" },
  ]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleSizeStockChange = (index: number, value: string) => {
    setSizes((prevSizes) =>
      prevSizes.map((item, i) =>
        i === index ? { ...item, stock: value } : item
      )
    );
  };

  const handleImageUpload = async () => {
    if (selectedImages.length === 0) return [];

    setUploading(true);
    const uploadedImageUrls = [];

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "productImages");
      formData.append("folder", "uploads");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/da4l4bhhn/image/upload",
          formData
        );
        uploadedImageUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
    return uploadedImageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      toast.warning('Image is not selected')
      return;
    }

    const imageUrls = await handleImageUpload();
    if (imageUrls.length === 0) {
      alert("Image upload failed. Please try again.");
      return;
    }

    const productData = {
      name,
      productCode, // ✅ Include productCode in data
      description,
      price: parseFloat(price),
      discountPrice : parseFloat(discountPrice),
 
      category,
      images: imageUrls,
      sizes: category === "Shoes"
        ? sizes.map((s) => ({ size: s.size, stock: parseInt(s.stock, 10) || 0 }))
        : [],
      stock: category === "Shoes" ? undefined : parseInt(stock, 10),
    };

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(productData),
      headers: { "Content-Type": "application/json" },
    });

    // Reset form fields
    setName("");
    setProductCode(""); // ✅ Reset productCode
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setStock("");
    setCategory("");
    setSizes([
      { size: "39", stock: "" },
      { size: "40", stock: "" },
      { size: "41", stock: "" },
      { size: "42", stock: "" },
      { size: "43", stock: "" },
      { size: "44", stock: "" },
    ]);
    setSelectedImages([]);
    setResetTrigger(true);
    toast.success('Product has been added')

    setTimeout(() => setResetTrigger(false), 100);
  };

  console.log(discountPrice)

  return (
    
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow py-20"
    >
      <Input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="Product Code" // ✅ New Input Field
        value={productCode}
        onChange={(e) => setProductCode(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <Input
        placeholder="Discount Price"
        type="number"
        value={discountPrice}
        onChange={(e) => setDiscountPrice(e.target.value)}
      />

      {/* Category Select */}
      <Select onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Shoes">Shoes</SelectItem>
          <SelectItem value="Bags">Bags</SelectItem>
          <SelectItem value="Accessories">Accessories</SelectItem>
        </SelectContent>
      </Select>

      {/* Sizes */}
      {category === "Shoes" && (
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((item, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm font-medium">{item.size}</label>
              <Input
                type="number"
                placeholder="Stock"
                value={item.stock}
                onChange={(e) => handleSizeStockChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      )}

      {/* Stock input for others */}
      {category !== "Shoes" && (
        <Input
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      )}

      {/* Image Upload */}
      <ImageUploader onImagesSelected={setSelectedImages} resetTrigger={resetTrigger} />

      <Button type="submit" disabled={uploading} variant={'custom'}>
        {uploading ? "Uploading..." : "Add Product"}
      </Button>
    </form>
  );
}
