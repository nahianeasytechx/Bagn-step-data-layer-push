"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Make sure you have a Button component
import { Order } from "@/types/types";

const ReceiptPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null); // ✅ ref for printable section

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ✅ Print Button */}
      <div className="flex justify-between mb-4 print:hidden">
        <h1 className="text-2xl font-bold ">Please take a screeshot or print this</h1>
        <Button onClick={handlePrint} variant="default">
          Print 
        </Button>
      </div>

      {/* ✅ Printable Receipt */}
      <div ref={printRef} className="bg-white p-4 rounded shadow print:shadow-none print:p-0">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Order Receipt</h2>
              <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
              <p className="text-sm text-muted-foreground">
                Order Date: {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
              <Badge variant="outline" className="mt-2 capitalize">{order.status}</Badge>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Customer Info</h3>
              <p>Name: {order.customer.name}</p>
              <p>Phone: {order.customer.phone}</p>
              {order.customer.address && <p>Address: {order.customer.address}</p>}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Ordered Products</h3>
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Code: {item.product.productCode}</p>
                    <p className="text-sm">Size: {item.productSize.size}</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium">Price: ৳{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="text-right space-y-1">
              <p className="text-sm">Subtotal: ৳{subtotal.toLocaleString()}</p>
              <p className="text-sm">Shipping: ৳{order.shippingCost.toLocaleString()}</p>
              <p className="text-lg font-semibold">
                Total: ৳{order.totalAmount.toLocaleString()}
              </p>
            </div>

            {order.note && (
              <div>
                <h4 className="font-medium">Note:</h4>
                <p className="text-sm text-muted-foreground">{order.note}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptPage;
