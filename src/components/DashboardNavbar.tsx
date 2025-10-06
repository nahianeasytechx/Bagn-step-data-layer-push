import { Bell, UserCircle } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <div className="flex justify-between w-full items-center bg-white shadow-md p-4 ml-64">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6 cursor-pointer" />
        <UserCircle className="w-8 h-8 cursor-pointer" />
      </div>
    </div>
  );
}
