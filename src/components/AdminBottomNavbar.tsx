"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, Package, ShoppingCart, Users,  PlusCircle, 
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Products", href: "/admin/manageProduct", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  // { name: "Reports", href: "/admin/reports", icon: BarChart },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminBottomNavbar() {
  const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
    localStorage.removeItem("admin-token"); // Clear JWT
    router.push("/admin/login"); // Redirect to login page
  };


  return (
    <nav className="z-10 fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 shadow-md">
      <div className="flex justify-around items-center py-2 relative">
        {adminLinks.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1">
            <Icon className={cn("w-5 h-5", pathname === href ? "text-white" : "text-gray-400")} />
            <span className={cn("text-xs", pathname === href ? "text-white font-medium" : "text-gray-400")}>
              {name}
            </span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-xs text-red-500 font-medium">Logout</span>
        </button>

        {/* Add Product Button - Centered */}

      </div>
    </nav>
  );
}
