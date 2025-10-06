"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/types";
import jsPDF from "jspdf";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    }
    fetchOrder();
  }, [id]);

  if (!order) return <p className="text-center mt-10">Loading order details...</p>;

  const downloadReceipt = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(33, 150, 243); // Blue
    doc.text("Order Receipt", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.line(20, 25, 190, 25); // horizontal line under header

    // Order Info
    doc.setFont("bold");
    doc.text("Order Details", 20, 35);
    doc.setFont("normal");
    doc.text(`Order ID: ${order.id}`, 20, 42);
    doc.text(`Status: ${order.status}`, 20, 49);
    doc.text(`Placed on: ${new Date(order.createdAt).toLocaleString()}`, 20, 56);

    // Customer Info
    doc.setFont("bold");
    doc.text("Customer Details", 20, 70);
    doc.setFont("normal");
    doc.text(`Name: ${order.customer?.name}`, 25, 77);
    doc.text(`Phone: ${order.customer.phone}`, 25, 84);
    if (order.customer.address) {
      doc.text(`Address: ${order.customer.address}`, 25, 91);
    }

    // Items Table
    let startY = 110;
    doc.setFont("bold");
    doc.setFillColor(33, 150, 243);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, startY - 6, 170, 8, "F"); // header background
    doc.text("Item", 22, startY);
    doc.text("Size", 90, startY);
    doc.text("Qty", 120, startY);
    doc.text("Price", 145, startY);
    doc.text("Total", 170, startY, { align: "right" });

    doc.setFont("normal");
    doc.setTextColor(0);
    order.items.forEach((item, idx) => {
      startY += 10;
      doc.text(item.product.name, 22, startY);
      doc.text(item.productSize.size, 90, startY);
      doc.text(`${item.quantity}`, 120, startY);
      doc.text(`${item.price}`, 145, startY);
      doc.text(`${(item.price * item.quantity).toFixed(2)} tk`, 170, startY, { align: "right" });
    });

    // Totals
    startY += 15;
    doc.setFont("bold");
    doc.text(`Shipping: ${order.shippingCost.toFixed(2)} tk`, 145, startY);
    startY += 10;
    doc.setFontSize(14);
    doc.text(`Total: ${order.totalAmount} tk`, 145, startY);

    // Special Instructions
    if (order.note) {
      startY += 15;
      doc.setFontSize(12);
      doc.setFont("bold");
      doc.text("Special Instructions:", 20, startY);
      doc.setFont("normal");
      startY += 7;
      doc.text(order.note, 25, startY);
    }

    doc.save(`Order_${order.id}.pdf`);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Success Header */}
      <div className="text-center mb-8 fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 relative">
          <div className="success-animation w-10 h-10 border-4 border-green-500 border-l-transparent rounded-full"></div>
          <svg
            className="absolute w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 fade-in">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-blue-100">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <Badge
              variant={
                order.status === "Completed"
                  ? "confirmed"
                  : order.status === "Pending"
                    ? "secondary"
                    : "destructive"
              }
              className="text-lg"
            >
              {order.status}
            </Badge>
          </div>
        </div>

        {/* Customer Information */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Customer Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{order.customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{order.customer.phone}</p>
            </div>
            {order.customer.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="font-medium text-gray-800">{order.customer.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 py-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Order Items
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {item.product.images[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    "🛍️"
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">
                    Product Code: {item.product.productCode}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Size: {item.productSize.size === 'default' ? "" : item.productSize.size}
                    </span>
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">৳{item.price} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Note */}
        {order.note && (
          <div className="px-6 py-4 bg-amber-50 border-l-4 border-amber-400">
            <h4 className="font-medium text-amber-800 mb-1">Special Instructions</h4>
            <p className="text-amber-700 text-sm">{order.note}</p>
          </div>
        )}

        {/* Order Total */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>
                ৳
                {order.items
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>৳{order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center ">
        <button onClick={downloadReceipt} className=" mx-auto flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-colors duration-200 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Download Receipt
        </button>
      </div>
    </div>
  );
}
