"use client";
import { useState, useMemo } from "react";
import { useCallback } from "react";

import ProductFilters from "@/components/productFilters";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/products";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Dots_v2 } from "@/components/Dots_v2";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError } = useProducts();



  const [filters, setFilters] = useState<{
    sizes: string[];
    categories: string[];
    priceRange: [number, number];
  }>({
    sizes: [],
    categories: [],
    priceRange: [0, 10000],
  });

  const [hasUserFiltered, setHasUserFiltered] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!hasUserFiltered) return products;

    return products.filter((product) => {

      const sizeMatch =
      filters.sizes.length === 0 ||
      product.sizes.some(
        (sizeObj) =>
          filters.sizes.includes(sizeObj.size) && sizeObj.stock > 0
      );

      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const priceMatch =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      return sizeMatch && categoryMatch && priceMatch;
    });
  }, [products, filters, hasUserFiltered]);



const handleFilterChange = useCallback((newFilters: typeof filters) => {
  setFilters(newFilters);
  setHasUserFiltered(true);
}, []);

  if (isLoading) return <div className="p-4"><Dots_v2/></div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load products.</div>;

  const prices = products.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000;

  return (
    <div className="p-4 space-y-4 max-w-screen-2xl mx-auto">
      {/* Mobile Filter Toggle Button */}
      <div className="block lg:hidden">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="default" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Filter Products
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4">
            <SheetHeader>
              <SheetTitle>Filter Product</SheetTitle> 
              <SheetDescription>
                
              </SheetDescription>
            </SheetHeader>
            <ProductFilters
              onChange={handleFilterChange}
              initialPriceRange={[minPrice, maxPrice]}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="flex gap-6">
        <div className="hidden lg:block w-64">
          <ProductFilters
            onChange={handleFilterChange}
            initialPriceRange={[minPrice, maxPrice]}
          />
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                productCode={product.productCode}
                images={product.images}
                price={product.price}
                discountPrice={product.discountPrice}
                category={product.category}
                sizes={product.sizes}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

