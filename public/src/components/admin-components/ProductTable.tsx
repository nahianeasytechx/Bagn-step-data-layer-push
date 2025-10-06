// components/ProductTable.tsx

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types/types";
import EditProductForm from "../EditProductForm";
import Image from "next/image";



export default function ProductTable({ products, onUpdate }: { products: Product[]; onUpdate: (updated: Product) => void }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<Product>();

  // Update form values when product changes
  useEffect(() => {
    if (selectedProduct) {
      reset(selectedProduct);
    }
  }, [selectedProduct, reset]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const onSubmit = (data: Product) => {
    onUpdate({ ...selectedProduct!, ...data });
    setIsEditOpen(false);
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 hidden md:block">Image</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
            {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Stock</th> */}
            {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th> */}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="hidden md:block ">
                <figure className="p-4">
                  <Image
                    className="h-20 w-20  rounded-full"
                    src={product?.images[0]}
                    width={50}
                    height={50}
                    alt="img"
                  />
                </figure>
              </td>
              <td className="px-4 py-3 ">
                {product.name}
              </td>

              <td className="px-4 py-3">{product.category}</td>
              <td className="px-4 py-3">${Number(product.price).toFixed(2)}</td>
              {/* <td className="px-4 py-3">{product.stock}</td> */}
              {/* <td className="px-4 py-3">
                <span className={`text-sm font-medium ${product.status ? "text-green-600" : "text-gray-500"}`}>
                  {product.status ? "Active" : "Inactive"}
                </span>
              </td> */}
              <td className="px-4 py-3 text-right space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} />
            </div>
            <div>
              <Label>Category</Label>
              <Input {...register("category")} />
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" {...register("stock", { valueAsNumber: true })} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
          {/* <EditProductForm product={} /> */}
        </DialogContent>
      </Dialog>

      {/* Delete Modal - same as before */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-500">{selectedProduct?.name}</span>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              // Call delete logic if needed
              console.log("Deleting:", selectedProduct?.id);
              setIsDeleteOpen(false);
            }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
