"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BottomNavbar from "@/components/BottomNavbar";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current route
  const isAdminRoute = pathname.startsWith("/admin"); // Check if it's an admin page

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          {!isAdminRoute && <Navbar />}
          <main className="flex-grow">{children}</main>
          <Toaster position="top-center" />

        </div>
        {!isAdminRoute && <BottomNavbar />}
        {!isAdminRoute && <Footer />}
      </QueryClientProvider>

    </>
  );
}
