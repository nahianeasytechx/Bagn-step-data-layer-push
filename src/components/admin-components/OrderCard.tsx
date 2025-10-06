"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Order } from "@/types/types";

interface OrderCardListProps {
  orders: Order[];
}

export default function OrderCardList({ orders }: OrderCardListProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 md:hidden ">
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="">
            <CardHeader />
            <CardContent className="flex flex-col gap-2 p-2">
              <p className="text-base font-semibold">Customer: {order.customer.name}</p>
              <p className="text-sm text-muted-foreground">Phone: {order.customer.phone}</p>
              {order.customer.address && (
                <p className="text-sm text-muted-foreground">Address: {order.customer.address}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm font-semibold">Total: ৳{order.totalAmount}</p>
              <p className="text-sm font-medium text-blue-600 capitalize">Status: {order.status}</p>
              {order.note && <p className="text-sm italic text-muted-foreground">Note: {order.note}</p>}
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                size="lg"
              >
                View Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="text-center text-muted-foreground">No orders found.</p>
      )}
    </div>
  );
}
