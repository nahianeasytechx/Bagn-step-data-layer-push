'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/types';
import ProductCard from './ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel";

export default function RelatedProducts({ fetchUrl }: { fetchUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  return (
    <div className=" max-w-5xl mx-auto px-2 mt-8">
      <h2 className="text-4xl font-bold mb-4 text-gray-800 text-center">You may also like</h2>
      <hr className='bg-orange-400 text-orange-400 h-2 rounded-md' />

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] h-[320px] bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <Carousel
          opts={{ align: 'start' }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 p-2"
              >
                <ProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      )}
    </div>
  );
}
