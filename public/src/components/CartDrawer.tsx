"use client";

import {  useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";

export default function CartDrawer({ isCartOpen, setCartOpen }: { isCartOpen: boolean; setCartOpen: (open: boolean) => void }) {
  const { cart, updateQuantity } = useCart();

  const prevCartLength = useRef(cart.length);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevCartLength.current = cart.length;
      return;
    }
    
    if (cart.length > prevCartLength.current) {
      setCartOpen(true);
    }
    prevCartLength.current = cart.length;
  }, [cart.length, setCartOpen]);

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Your Shopping Cart</SheetTitle>
        </SheetHeader>

        {/* Animate Cart Items */}
        <div>
          <div className="p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col gap-4 justify-center items-center">
                <p className="text-gray-500 text-center">Your cart is empty.</p>
                <Link href="/products">
                  <Button onClick={() => setCartOpen(false)}>RETURN TO SHOP</Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        // initial={{ opacity: 0, x: 30 }}
                        // animate={{ opacity: 1, x: 0 }}
                        // exit={{ opacity: 0, x: 30 }}
                        // transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center gap-4 border-b pb-3"
                      >
                    
                        <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold">{item.name}</h3>
                          <p className="text-gray-600 text-xs">${item.price} x {item.quantity}</p>
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.size as string, item.quantity - 1)} disabled={item.quantity === 1}>
                            <Minus size={16} />
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id,  item.size as string, item.quantity + 1)}>
                            <Plus size={16} />
                          </Button>
                        </div>
                        
                      </div>
                    ))}

                </div>

                {/* Cart Summary */}
                <div className="border-t pt-4 absolute bottom-10 w-[80%]">
                  <p className="text-lg font-semibold">
                    Total: $
                    {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                  </p>
                  <div className="mt-3 flex flex-col gap-3">
                    <Link href="/cart">
                      <Button onClick={() => setCartOpen(false)} className="w-full">
                        <ShoppingCart size={24} />
                        VIEW CART
                      </Button>
                    </Link>
                    <Link href="/checkout">
                      <Button onClick={() => setCartOpen(false)} className="w-full ">CHECKOUT</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
