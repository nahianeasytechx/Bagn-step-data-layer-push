"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
// adjust to your barrel‑file setup

import { Plus, Search, Trash2, SquarePen, Eye } from "lucide-react";
import DotsLoader from "@/components/DotsLoader";
import { Product } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import SizeDialog from "@/components/SizeDialog";
import EditProductDialog from "@/components/EditProductForm";

import ArchiveProductDialog from "@/components/DeleteProductDialog";
import DeleteProductDialog from "@/components/DeleteProductDialog";

/**
 * Env
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

/**
 * Pagination helpers
 */
const PAGE_SIZE = 10;

export default function ProductInventoryPage() {
  /** --------------------------------------------------
   * State
   * --------------------------------------------------*/
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  /** --------------------------------------------------
   * Data fetching
   * --------------------------------------------------*/
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Product[]>(`${API_URL}/products`);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣  Call it once on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  /** --------------------------------------------------
   * Derived data
   * --------------------------------------------------*/
  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    return products.filter((p) =>
      [p.name, p.productCode, p.category]
        .map((s) => s.toLowerCase())
        .some((text) => text.includes(query.toLowerCase()))
    );
  }, [query, products]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /** --------------------------------------------------
   * Actions
   * --------------------------------------------------*/
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(pageCount, p + 1));

  /** --------------------------------------------------
   * UI
   * --------------------------------------------------*/
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 pt-24">
        <DotsLoader />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 pt-24">
        <h1 className="text-xl font-semibold text-center">No product available</h1>
        <Link href="/admin/addProduct">
          <Button>
            Add product <Plus className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-semibold">Product Inventory</h2>

        <div className="flex w-full max-w-md items-center gap-2 md:w-auto">
          {/* search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          {/* add */}
          <Link href="/admin/addProduct">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-72">Product</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageItems.map((item) => (
              <TableRow key={item.id} className="whitespace-nowrap">
                {/* Product cell */}
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.images?.[0] ?? "/placeholder.svg"}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium leading-none">{item.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-28">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Code */}
                <TableCell>{item.productCode}</TableCell>

                {/* Category */}
                <TableCell>
                  <Badge >{item.category}</Badge>
                </TableCell>

                {/* Price */}
                <TableCell className="text-right font-medium">
                  {item.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD", // change to BDT if needed
                    minimumFractionDigits: 2,
                  })}
                </TableCell>

                {/* Stock + View sizes dialog */}
                <TableCell className="text-right">
                  <SizeDialog productName={item.name} sizes={item.sizes} />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">

                  <EditProductDialog product={item} onUpdated={fetchProducts} />
                  <DeleteProductDialog
                    productId={item.id}
                    productName={item.name}
                    onDeleted={fetchProducts}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer – Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1}‑{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={handlePrev}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === pageCount}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
