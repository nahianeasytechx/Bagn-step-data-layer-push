"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Dots_v2 } from "./Dots_v2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { bangladeshDistricts } from '@/data/district'
import { CartItem } from "@/types/types";




export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const productId = searchParams.get("product");
  const selectedSize = searchParams.get("size");
  const quantity = Number(searchParams.get("quantity")) || 1;

  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [selectedShipping, setSelectedShipping] = useState("70");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",   // House/Village
    thana: "",     // Thana/Upazila
    district: "",  // District
    note: ""
  });

  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchProductIfNeeded() {
    if (cart.length === 0 && !productId) {
      setLoading(false);
      return;
    }

    let products: CartItem[] = [];

    if (productId) {
      let product = cart.find((item) => item.id === productId);

      if (!product) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("data : ", data);

            product = {
              id: data.id,
              name: data.name,
              price: data.discountPrice ?? data.price,
              image: data.images[0],
              quantity: quantity, // Make sure quantity is defined
              size: selectedSize ?? "Default",
              category: data.category,
            }
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }

      if (product) {
        products = [{
          ...product,
          productId: product.id,
          size: product.category?.toLowerCase() === "shoes" ? selectedSize : "Default"
        }];
      }
    } else {
      products = cart.map(item => ({
        ...item,
        productId: item.id,
        size: item.category?.toLowerCase() === "shoes" ? item.size : "Default"
      }));
    }

    setSelectedProducts(products);
    setLoading(false);
  }

  fetchProductIfNeeded();
}, [productId, cart, selectedSize, quantity]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, mobile, address } = formData;

    if (!name || !mobile || !address) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    const fullAddress = [
      formData.address,
      formData.thana,
      formData.district
    ]
      .filter(Boolean)
      .join(", ");


    if (selectedProducts.length === 0) {
      toast.error("No Products", {
        description: "Your cart is empty.",
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.mobile,
          address: fullAddress,
          note: formData.note,
          shippingCost: selectedShipping,
          items: selectedProducts.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.discountPrice ?? item.price,
          })),
        }),
      });

      if (response.ok) {
        const order = await response.json(); // ✅ Get the order data from backend

     
 
        

        toast.success("Order Placed Successfully!", {
          description: "We will contact you soon for confirmation.",
        });

        clearCart();

        // ✅ Redirect to receipt page using order ID
        console.log(order.order.id)
        router.push(`/order-confirmation/${order.order.id}`);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Order Failed", {
        description: "There was an error processing your order. Please try again.",
      });
    }
  };


  const subTotal = selectedProducts.reduce(
    (total, item) => total + (item.discountPrice ?? item.price) * item.quantity,
    0
  );

  const total = subTotal + Number(selectedShipping);

  if (loading) return <Dots_v2 />;

  console.log(selectedProducts[0].discountPrice)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout - Cash on Delivery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {selectedProducts.length > 0 ? (
            <div className="space-y-4">
              {selectedProducts.map((product) => (
                <div key={`${product.id}-${product.size}`} className="flex items-center gap-4 border-b pb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    {product.category?.toLowerCase() === "shoes" && product.size && (
                      <p className="text-gray-600">Size: {product.size}</p>
                    )}
                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                    <p className="font-semibold text-lg">
                      ৳{((product?.discountPrice ?? product.price) * product.quantity).toFixed(2)}
                    </p>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products in your order</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/shop")}>
                Continue Shopping
              </Button>
            </div>
          )}

          {selectedProducts.length > 0 && (
            <>
              <p className="flex justify-between font-semibold mt-4 border-b pb-4">
                <span>Subtotal:</span> ৳{subTotal.toFixed(2)}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Shipping:</h3>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="70" id="inside-dhaka" />
                    <Label htmlFor="inside-dhaka">Inside Dhaka: <span className="font-semibold">70৳</span></Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="130" id="outside-dhaka" />
                    <Label htmlFor="outside-dhaka">Outside Dhaka: <span className="font-semibold">130৳</span></Label>
                  </div>
                </RadioGroup>
              </div>

              <p className="flex justify-between font-semibold mt-4 border-b pb-4">
                <span>Total:</span> ৳{total.toFixed(2)}
              </p>
            </>
          )}
        </div>

        {/* Billing & Shipping Form */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Billing & Shipping</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name ( ক্রেতার নাম )*</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number ( মোবাইল নং ) *</Label>
              <Input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="01XXXXXXXXX"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Detail Address ( বিস্তারিত ঠিকানা ) *</Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="House/Road/Village/Area name"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Thana/Upazila (থানা/উপজেলা) *</Label>
              <Input
                type="text"
                id="address"
                name="thana"
                placeholder="থানা/উপজেলা"
                value={formData.thana}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">District  ( জেলা ) *</Label>
              <Select
                value={formData.district}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, district: value }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {
                    bangladeshDistricts.map((district, idx) => {
                      return <SelectItem key={idx} value={district}>{district}</SelectItem>
                    })
                  }
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="note">Order Note (Optional)</Label>
              <textarea
                id="note"
                name="note"
                placeholder="Any special instructions?"
                value={formData.note}
                onChange={handleChange}
                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <p className="text-sm text-gray-600">
              কোন প্রকার এডভান্স পেমেন্ট ছাড়াই সারাদেশে হোম ডেলিভারি। অর্ডার করুন নিশ্চিন্তে!
            </p>

            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
