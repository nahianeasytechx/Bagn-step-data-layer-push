"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AdminBottomNavbar from "@/components/AdminBottomNavbar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  const publicRoutes = ["/admin/login"];
  const isLoginPage = pathname === "/admin/login";
  const isPublic = publicRoutes.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");

    if (!token && !isPublic) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [pathname, isAuthenticated,router, isPublic]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#f9fafc]">
      {!isLoginPage && (
        <>
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <div className="lg:hidden">
            <AdminBottomNavbar />
          </div>
        </>
      )}

      <div className={`flex-1 ${!isLoginPage ? "lg:ml-64" : ""} p-6`}>
        {!isLoginPage && (
          <Link href={"/"} className="flex justify-center">
            <figure>
              {/* <Image src="/images/logo.png" width={200} height={100} alt="logo" /> */}
            </figure>
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
