"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean; // Added loading state
  setCartOpen: (isOpen: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const prevCartLength = useRef(0);
  const initialLoad = useRef(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && !initialLoad.current) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Cart length change detection
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      prevCartLength.current = cart.length;
      return;
    }

    if (cart.length > prevCartLength.current) {
      setCartOpen(true);
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  const addToCart = async (item: CartItem) => {
    if (item.quantity < 1) return;
    
    setIsLoading(true);
    try {
      setCart((prev) => {
        const existingItem = prev.find(
          (i) => i.id === item.id && i.size === item.size
        );

        return existingItem
          ? prev.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity, price: Number(item.price) }
                : i
            )
          : [...prev, { ...item, price: Number(item.price) }];
      });
      toast.success("Product added to cart");
      document.dispatchEvent(new Event("cartUpdated"));
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string, size: string) => {
    setIsLoading(true);
    try {
      setCart((prev) => 
        prev.filter((item) => !(item.id === id && item.size === size))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, size: string, quantity: number) => {
    setIsLoading(true);
    try {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.size === size 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setIsLoading(true);
    try {
      setCart([]);
      setCartOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading, // Expose loading state
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};