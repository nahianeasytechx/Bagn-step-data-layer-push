"use client"

import SalesChart from "@/components/admin-components/SalesChart";
import StatCard from "@/components/admin-components/StatCard";

import { useLowStock, useProducts } from "@/hooks/products";
import { useOrderCounts, useTotalSales } from "@/hooks/useState";
import { Order, Product } from "@/types/types";
import axios, { all } from "axios";
import { Clipboard, DollarSign, ShoppingBag, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductTable from "@/components/admin-components/ProductTable";
import ProductModal from "@/components/admin-components/ProductModal";
import EditProductForm from "@/components/EditProductForm";
import { toast } from "sonner";


export default function AdminDashboardPage() {
  const { data: totalSales } = useTotalSales();
  const { data: orderCounts } = useOrderCounts();
  const { data: lowStock } = useLowStock()
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);



  const router = useRouter();

  console.log('totalsales-', totalSales)
  console.log('lowStock', lowStock)
  console.log('allProducts', products)

  const handleEdit = (id: string) => {
    console.log("Edit product with ID:", id);
    // Open modal, navigate, or set selected state
  };

  const handleDelete = (id: string) => {
    console.log("Delete product with ID:", id);
    // Trigger confirmation or API call
  };

    const handleUpdate = (updatedProduct: Product) => {
    // Update the local product list
    const updatedList = products.map((prod) =>
      prod.id === updatedProduct.id ? updatedProduct : prod
    );
    setProducts(updatedList);
    
    

    toast.success("Product updated successfully");
  };

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) router.push("/admin/login");
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/pending`);
        setOrders(res.data);

      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        setProducts(res.data);

      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);



  return (
    <div className="md:p-6 lg:p-8 mb-16">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-lg font-medium text-[#615655]">
        Welcome back, heres whats happening with your inventory today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  gap-6 mt-4">
        <StatCard
          title="Total Sales This Month"
          value={`${Number(totalSales).toLocaleString("en-BD")} tk`}
          icon={<DollarSign size={35} color="#2e9653" />}
          iconbg="bg-[#dcfce7]"
        />

        <StatCard
          title="Pending Orders"
          value={orders.length}
          icon={<Clipboard size={35} color="#514db9" />}
          iconbg="bg-[#e1e7ff]"
        />

        <StatCard
          title="Low Stock Items"
          value={lowStock?.length}
          icon={<TriangleAlert size={35} color="#c7642a" />}
          iconbg="bg-[#ffedd5]"
        />

        <StatCard
          title="Total Products"
          value={products?.length}
          icon={<ShoppingBag size={35} color="#514db9" />}
          iconbg="bg-[#e1e7ff]"
        />
      </div>

      <SalesChart />

      {/* <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <ProductTable onUpdate={handleUpdate} products={products}/>
      </div> */}


    </div>
  );
}
