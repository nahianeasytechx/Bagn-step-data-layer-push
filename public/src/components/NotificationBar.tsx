"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import Link from "next/link";


type Order = {
    id: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    createdAt: string;
    totalAmount: string;
    status: string;
    items: {
        product: {
            name: string;
            images: string[];
        };
        productSize: {
            size: string;
        };
        quantity: number;
        price: string;
    }[];
};

const getStatusBadgeClass = (status: string) => {


    return clsx(
        "text-xs font-semibold px-2 py-0.5 rounded-full capitalize",
        {
            pending: "bg-yellow-100 text-yellow-800",
            shipped: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        }[status.toLowerCase()] || "bg-gray-100 text-gray-800"
    );
};

export default function NotificationBar() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`https://api.bagnstep.com/api/admin/orders/latest`);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const notificationList = (

        <div className="space-y-4 max-h-[300px] overflow-y-auto w-[280px] sm:w-auto">
            {orders.map((order) => (


                <div
                    key={order.id}
                    className="bg-muted p-3 rounded-lg shadow-sm border border-border text-sm"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-y-1">
                        <div className="font-semibold">{order.customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-1">
                        📞 {order.customer.phone}
                    </div>

                    <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                    </span>

                    <div className="mt-2 space-y-1">
                        {order.items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-wrap items-center justify-between text-sm"
                            >
                                <span className="truncate">
                                    {item.product.name} (Size {item.productSize.size})
                                </span>
                                <span className="font-medium ml-2 sm:ml-0">x{item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 text-right font-bold text-primary text-sm sm:text-base">
                        ৳{order.totalAmount}
                    </div>

                    <Link href={"/orders"}>
                        <Button >View orders</Button>
                    </Link>


                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin mr-2 h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Loading new orders...</span>
            </div>
        );
    }

    return (
        <>
            {/* Desktop view */}
            <div className="hidden sm:block">{notificationList}</div>

            {/* Mobile view dropdown */}
            <div className="sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="relative">
                            <Bell className="h-5 w-5" />


                            {orders.length > 0 && orders[0].status === "pending" && (
                                <Badge
                                    className="absolute -top-1 -right-1 rounded-full text-[10px] px-1.5 py-0.5"
                                    variant="destructive"
                                >
                                    {orders.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-full max-h-[400px] overflow-y-auto">
                        {orders.length === 0 || orders[0].status === "shipped" ? (
                            <p className="text-muted-foreground text-sm p-2">No new orders</p>
                        ) : (
                            notificationList
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
