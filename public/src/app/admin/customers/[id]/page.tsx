"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Customer, Order, OrderItem } from "@/types/types";

export default function Page() {

  const { id } = useParams(); // from dynamic route [id]
  console.log(id)
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCustomer = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/order/${id}`);
      const data = await res.json();
      setCustomer(data);
    };

    fetchCustomer();
  }, [id]);

  if (!customer) return <p className="text-center mt-10">Loading customer data...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription>Phone: {customer.phone}</CardDescription>
        </CardHeader>
      </Card>

      {/* Orders */}
      {customer.orders.length === 0 ? (
        <p className="text-muted-foreground text-center">No orders found.</p>
      ) : (
        customer.orders.map((order: Order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="text-lg">Order ID: {order.id}</CardTitle>
              <CardDescription>Date: {new Date(order.createdAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b pb-2 last:border-none"
                >
                  <div>
                    <p className="font-semibold">{item.product.productCode}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.productSize?.size ?? "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="text-sm">৳ {item.price}</Badge>
                  </div>
                </div>
              ))}
              <Separator />
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm font-semibold">Total Items: {order.items.reduce((acc, i) => acc + i.quantity, 0)}</p>
              <p className="text-lg font-bold text-green-600">
                ৳ {order.items.reduce((acc, i) => acc + i.price * i.quantity, 0)}
              </p>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
