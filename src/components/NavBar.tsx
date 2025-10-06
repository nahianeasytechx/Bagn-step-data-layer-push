"use client";

import {  useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext"; // ✅ Import cart context
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart(); // ✅ Get cart from context
 
  const closeMenu = () => setOpen(false);

  return (
    <nav className="shadow-md flex items-center bg-[#FF6B00] sticky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href={"/"}>
            <Image src={"/images/logo.png"} width={100} height={0} alt="logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            <Link href="/" className="text-white hover:text-gray-900 font-bold">HOME</Link>
            <Link href="/products" className="text-white hover:text-gray-900 font-bold">ALL PRODUCTS</Link>
            {/* <Link href="/services" className="text-white hover:text-gray-900 font-bold">PREMIUM QUALITY</Link>
            <Link href="/contact" className="text-white hover:text-gray-900 font-bold">DISCOUNT</Link> */}
            <Link href="/sizechart" className="text-white hover:text-gray-900 font-bold">SIZE CHART</Link>

            <div className="relative">
              <button onClick={() => setCartOpen(true)} className="relative">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Reusable Cart Drawer */}
            <CartDrawer isCartOpen={cartOpen} setCartOpen={setCartOpen} />

          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger>
                <Menu size={24} className="text-gray-700" />
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>HOME</Link>
                  <Link href="/products" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>ALL PRODUCTS</Link>
                  {/* <Link href="/services" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>PREMIUM QUALITY</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>DISCOUNT</Link> */}
                  <Link href="/sizechart" className="text-gray-700 hover:text-gray-900 font-bold" onClick={closeMenu}>SIZE CHART</Link>
                </div>
              </SheetContent>
            </Sheet>

            <div className="relative">
              <button onClick={() => setCartOpen(true)} className="relative">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Reusable Cart Drawer */}
            <CartDrawer isCartOpen={cartOpen} setCartOpen={setCartOpen} />

          </div>
        </div>
      </div>
    </nav>
  );
}
