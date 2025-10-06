import { Order, Product } from "@/types/types";
import { useQuery } from "@tanstack/react-query";


const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};



const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const fetchLowStock = async (): Promise<Product[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/low-stock`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};


export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  
};


export const useLowStock = () => {
return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchLowStock,
  });
}
