import { FC } from "react";
import { OrderItem } from "@/types/types";
import Image from "next/image";

interface OrderItemListProps {
  items: OrderItem[];
}

export const OrderItemList: FC<OrderItemListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-4 border-b pb-3 last:border-none"
        >
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-14 h-14 object-cover rounded-md border"
          />
          <div className="flex-1 text-sm space-y-1">
            <div className="font-semibold text-base">{item.product.name}</div>
            <div className="text-xs text-muted-foreground">
              Product ID: <span className="font-mono">{item.product.id}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Size: <span className="font-medium">{item.productSize?.size ?? "Default"}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Quantity: <span className="font-medium">{item.quantity}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Price: <span className="font-medium">৳ {item.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
