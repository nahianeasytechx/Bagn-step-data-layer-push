"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTopProducts } from "@/hooks/useState";

import Image from "next/image";

export default function TopSellingProducts() {
  const { data: topProducts, isLoading } = useTopProducts();

  return (
    <Card className="admin-card mt-4">
      <CardHeader>
        <CardTitle className="mb-4 text-left">Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !topProducts || topProducts.length === 0 ? (
          <p className="text-muted-foreground">No top selling products found.</p>
        ) : (
          <ul className="space-y-4">
            {topProducts.map((product: any) => (
              <li
                key={product.productId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {product.images?.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  <span className="font-medium text-sm">{product.name}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {product._sum?.quantity ?? 0} sold
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
