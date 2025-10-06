"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

/** ──────────────────────────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────────────────────────*/
export type Size = { size: string; stock: number };

interface SizeDialogProps {
  productName: string;
  sizes: Size[];
}

export default function SizeDialog({ productName, sizes }: SizeDialogProps) {
  const total = sizes.reduce((sum, s) => sum + s.stock, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-primary">
          {total}
          <Eye className="ml-1 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]  rounded-xl">
        <DialogHeader>
          <DialogTitle>{productName} – Sizes</DialogTitle>
          <DialogDescription>
            Stock breakdown by size for the selected product.
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((s) => (
              <TableRow key={s.size}>
                <TableCell>{s.size}</TableCell>
                <TableCell className="text-right">{s.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
