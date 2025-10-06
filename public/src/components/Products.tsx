"use client";

import { useProducts } from "@/hooks/products";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { VelocityScroll } from "./magicui/scroll-based-velocity";
import AnimatedLoader from "./AnimatedLoader";

export default function Products() {
  const [showLoader, setShowLoader] = useState(true);
  const { data: products = [], isLoading, isError } = useProducts();

  // Hide loader after animation AND data is loaded
  useEffect(() => {
    if (!isLoading && !isError) {
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 3000); // sync with AnimatedLoader duration
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isError]);

  if (showLoader || isLoading) {
    return (
      <div className="p-4">
        <AnimatedLoader onFinish={() => setShowLoader(false)} />
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load products.</div>;
  }

  // Group products by category
  const shoes = products.filter((p) => p.category?.toLowerCase() === "shoes");
  const bags = products.filter((p) => p.category?.toLowerCase() === "bags");

  return (
    <div className="p-4 space-y-10">
      {/* Shoes Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 italic">Shoes</h2>
        {shoes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {shoes.map(({ id, name, price, discountPrice , images, sizes, category, productCode }) => (
              <ProductCard
                key={id}
                id={id}
                name={name}
                productCode={productCode}
                images={images}
                sizes={sizes}
                price={price}
                discountPrice={discountPrice}
                category={category}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No shoes available.</p>
        )}
      </div>

      <div className="">
        <VelocityScroll>BagNStep</VelocityScroll>
      </div>

      {/* Bags Section */}
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-3xl font-bold mb-4 italic">Bags</h2>
        {bags.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {bags.map(({ id, name, price, discountPrice, images, sizes, category, productCode }) => (
              <ProductCard
                key={id}
                id={id}
                name={name}
                productCode={productCode}
                images={images}
                sizes={sizes}
                price={price}
                discountPrice={discountPrice}
                category={category}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No bags available.</p>
        )}
      </div>
    </div>
  );
}
