"use client";
import { useState } from "react";
import SimpleTable from "@/components/NewOrderTable";
import OrderCardList from "@/components/admin-components/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/types/types";

const OrdersPage: React.FC = () => {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order: Order) => {
    const name = order.customer.name?.toLowerCase() || "";
    const phone = order.customer.phone || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  return (
    <div className="p-4 mt-8">
      <h1 className="text-4xl font-bold mb-4 cal-sans text-center">Order List</h1>

      <input
        type="text"
        placeholder="Search by customer name or phone"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 px-3 py-2 border rounded-md w-full"
      />

      <div className="hidden md:block">
        <SimpleTable orders={filteredOrders}  />
      </div>

      <OrderCardList orders={filteredOrders} />
    </div>
  );
};

export default OrdersPage;
