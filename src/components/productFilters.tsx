"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

type ProductFiltersProps = {
  onChange: (filters: {
    sizes: string[];
    categories: string[];
    priceRange: [number, number];
  }) => void;
  initialPriceRange: [number, number];
};

const ALL_SIZES = ["39", "40", "41", "42", "43", "44"];
const CATEGORIES = ["Shoes", "Bags"];

export default function ProductFilters({
  onChange,
  initialPriceRange,
}: ProductFiltersProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialPriceRange
  );

  useEffect(() => {
    onChange({
      sizes: selectedSizes,
      categories: selectedCategories,
      priceRange,
    });
  }, [selectedSizes, selectedCategories, priceRange,onChange]);

  const minPrice = initialPriceRange[0];
  const maxPrice = initialPriceRange[1];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Filter size={18} /> Filters
      </h2>

      {/* Category Filter */}
      <div className="space-y-2">
        <h3 className="font-medium">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategories.includes(category)
                  ? "default"
                  : "outline"
              }
              size="sm"
              className="w-full justify-start"
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                )
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2">
        <h3 className="font-medium">Price Range</h3>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
        />
        <div className="flex justify-between text-sm">
          <span>৳{priceRange[0]}</span>
          <span>৳{priceRange[1]}</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2">
        <h3 className="font-medium">Shoe Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {ALL_SIZES.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((s) => s !== size)
                    : [...prev, size]
                )
              }
            >
              {size}
            </Button>
          ))}
        </div>
      </div>


    </div>
  );
}
