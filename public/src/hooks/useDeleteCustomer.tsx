// hooks/useDeleteCustomer.ts
"use client";

import { useState } from "react";

export const useDeleteCustomer = () => {
  const [loading, setLoading] = useState(false);

  const deleteCustomer = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  return { deleteCustomer, loading };
};
