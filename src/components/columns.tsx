// app/admin/orders/columns.ts
"use client";

import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types/types";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => {
      return <span>{row.original.customer?.name || "N/A"}</span>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return <span>৳ {parseFloat(String(row.original.totalAmount)).toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Select
          defaultValue={order.status}
          onValueChange={async (value) => {
            try {
              await axios.put(`/api/orders/${order.id}/status`, { status: value });
              toast.success("Order status updated");
            } catch (error) {
              console.log(error)
              toast.error("Failed to update status");
            }
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return <span>{format(new Date(row.original.createdAt), "PPP")}</span>;
    },
  },
];
