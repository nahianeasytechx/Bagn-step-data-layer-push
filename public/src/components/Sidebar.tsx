"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Plus,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, href: "/admin" },
  { name: "Products", icon: <Package />, href: "/admin/manageProduct" },
  { name: "Orders", icon: <ShoppingCart />, href: "/admin/orders" },
  { name: "Customers", icon: <Users />, href: "/admin/customers" },
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin-token"); // Clear JWT
    router.push("/admin/login"); // Redirect to login page
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.href}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
          <li className="mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 hover:bg-red-700 rounded w-full text-left"
            >
              <LogOut />
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
