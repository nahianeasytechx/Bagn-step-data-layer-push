"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash, Minus, Plus } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaWhatsapp } from "react-icons/fa";
import AnimatedLoader from "@/components/AnimatedLoader";
import { useState } from "react";


export default function CartPage() {
   const [showLoader,setShowLoader] = useState(true);
  const { cart, removeFromCart, updateQuantity , isLoading } = useCart();

  const phone = "8801836282169";
  const message = encodeURIComponent("Hi, I'm interested in your shoes!");
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;


  console.log(cart)



  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if(isLoading){
    return <AnimatedLoader onFinish={() => setShowLoader(false)} />
  }

  return (
    <>

      <div className="max-w-6xl mx-auto p-6 hidden md:block">
        <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-gray-500 text-center">Your cart is empty.</p>
            <Link href={`/products`}>
              <Button>RETURN TO SHOP</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items Table (2/3 width) */}
            <div className="md:col-span-2 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="w-[50px] text-center">Remove</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow className="" key={`${item.id}-${item.size}`}>
                      {/* Product */}
                      <TableCell className="flex items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          {item.size && <p className="text-gray-500 text-sm">Size: {item.size}</p>}
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell>${Number(item.price).toFixed(2)}</TableCell>

                      {/* Quantity */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Button

                            size="icon"
                            onClick={() => updateQuantity(item.id, item.size as string, item.quantity - 1)}
                            disabled={item.quantity === 1}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="text-md font-semibold">{item.quantity}</span>
                          <Button

                            size="icon"
                            onClick={() => updateQuantity(item.id, item.size as string, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </TableCell>

                      {/* Subtotal */}
                      <TableCell className="font-semibold">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell className="text-center">
                        <Button size="icon" variant={"destructive"} onClick={() => removeFromCart(item.id, item.size as string)}>
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Cart Summary (1/3 width) */}
            <div className="border-2 p-6 flex flex-col gap-4 rounded-md shadow-md">
              <h3 className="text-xl font-semibold">Cart Summary</h3>
              <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
{/* 
              <Button onClick={clearCart} variant={'default'} >
                Clear Cart
              </Button> */}

              <Link href="/checkout">
                <Button variant={'custom'} className="w-full text-white">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant={'whatsapp'} className="w-full text-white">
                  WhatsApp <FaWhatsapp/>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile view ......................................................... */}


      <div className="max-w-6xl mx-auto p-4 md:hidden">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-gray-500 text-center">Your cart is empty.</p>
            <Link href="/products">
              <Button>RETURN TO SHOP</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
            {/* Mobile-friendly cart items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Product Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md w-16 h-16 md:w-20 md:h-20"
                      />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm md:text-base">{item.name}</p>
                        {item.size && (
                          <p className="text-gray-500 text-sm font-semibold">Size: {item.size}</p>
                        )}
                        {/* <p className="md:hidden text-sm font-semibold">
                          Price :  ${(item.price).toFixed(2)}
                        </p> */}

                        {item.quantity > 1 && (
                          <p className="md:hidden text-sm font-semibold">
                            Total Price :  ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="hidden md:block text-sm">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.size as string, item.quantity - 1)}
                            disabled={item.quantity === 1}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.size as string, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="hidden md:block text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button (Mobile) */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="md:hidden my-auto "
                      onClick={() => removeFromCart(item.id, item.size as string)}
                    >
                      <Trash size={16} />
                    </Button>


                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-2 p-4 md:p-6 flex flex-col gap-4 rounded-md shadow-md h-fit">
              <h3 className="text-lg md:text-xl font-semibold">Cart Summary</h3>
              <p className="text-lg md:text-xl font-semibold">Total: ৳{totalPrice.toFixed(2)}</p>

              {/* <Button onClick={clearCart} className="w-full">
                Clear Cart
              </Button> */}

              <Link href="/checkout">
                <Button variant={"custom"} className="w-full text-white">Proceed to Checkout</Button>
              </Link>

              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant={'whatsapp'} className="w-full text-white">
                  WhatsApp <FaWhatsapp/>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
