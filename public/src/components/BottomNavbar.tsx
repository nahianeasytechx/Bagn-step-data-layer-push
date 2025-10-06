"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
  // assuming your store is named like this

const tabs = [
  { title: "Home", icon: Home, href: "/" },
  { title: "Shop", icon: ShoppingBag, href: "/products" },
  { title: "Cart", icon: ShoppingCart, href: "/cart" },
];

export default function BottomNavbar() {
  const pathname = usePathname();
  const { cart } = useCart();
   // pulling cart data from store

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-zinc-900 p-2 rounded-full shadow-2xl flex justify-around items-center lg:hidden ">
      {tabs.map(({ title, icon: Icon, href }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={title}
            href={href}
            className="relative z-10 flex flex-col items-center justify-center px-4 py-2"
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute inset-0 rounded-full bg-black dark:bg-white z-0"
              />
            )}
            <span className="relative z-10 flex flex-col items-center">
              <Icon
                size={20}
                className={cn(
                  "mb-1 transition-colors",
                  isActive ? "text-white dark:text-black" : "text-black dark:text-white"
                )}
              />
              {/* Cart Badge */}
              {title === "Cart" && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
