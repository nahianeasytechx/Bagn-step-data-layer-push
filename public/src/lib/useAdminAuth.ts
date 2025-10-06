// hooks/useAdminAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.replace("/admin/login");
  }, [router]);
}
