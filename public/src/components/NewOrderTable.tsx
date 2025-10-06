"use client";

import { Order } from "@/types/types";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SimpleTableProps {
  orders: Order[];
  // onDelete?: (id: string) => void; // optional if you want to pass delete logic
}

const SimpleTable = ({ orders}: SimpleTableProps) => {
  const router = useRouter();

  // const handleDelete = (id: string) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this order?");
  //   if (confirmDelete && onDelete) {
  //     onDelete(id);
  //   }
  // };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-md border overflow-x-auto hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            {/* <TableHead>Actions</TableHead> */}
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.slice(0, 8)}...</TableCell>
                <TableCell>{order.customer?.name || "N/A"}</TableCell>
                <TableCell>{order.customer?.phone || "N/A"}</TableCell>
                <TableCell>
                  {Number(order.totalAmount).toLocaleString("en-BD", {
                    style: "currency",
                    currency: "BDT",
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                {/* <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </TableCell> */}
                <TableCell>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push(`./orders/${order.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SimpleTable;
