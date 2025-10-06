"use client";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getCustomers } from "@/lib/api";
import InfoCard from "@/components/InfoCard";
import { Customer } from "@/types/types";


export default function CustomerPage() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = data.filter((customer : Customer) => {
    const name = customer.name?.toLowerCase() || "";
    const phone = customer.phone || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  useEffect(() => {
    getCustomers().then(setData).catch(console.error);
  }, []);


  

  return <div className="mt-10">
    <h1 className="text-2xl font-bold py-2">Customer History</h1>
    <input
        type="text"
        placeholder="Search by name or phone"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-3 py-2 border rounded-md w-full"
      />
    <div className="hidden md:block">
      <DataTable  columns={columns} data={filteredCustomers} />
    </div>

    <InfoCard customers={filteredCustomers} />
  </div>;
}
