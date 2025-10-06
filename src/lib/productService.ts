"use client"

import axios from "axios";

interface Product {
  id: number;
  name: string;
  images: string[];
  title: string;
  price: number;
  product_name: string;
  // sizes: Size[];  // ✅ Now it correctly expects an array of size objects
}


export const fetchProducts = async () => {
  const { data } = await axios.get("/api/products");
  return data;
};

export const addProduct = async (product : Product) => {
  const { data } = await axios.post("/api/products", product);
  return data;
};
