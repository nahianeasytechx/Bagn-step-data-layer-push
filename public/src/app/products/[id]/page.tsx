"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import ProductImageSlider from "@/components/ProductImageSlider";
import { motion } from "motion/react";
import Breadcrumb from "@/components/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Product, ProductSize } from "@/types/types";
import RelatedProducts from "@/components/RelatedProducts";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { Dots_v2 } from "@/components/Dots_v2";

export default function ProductDetailPage() {
  const { id: product_id } = useParams();
  const router = useRouter();
  const productId = String(product_id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const noStock = (size: ProductSize, stock: number) => {
    if (stock === 0) {
      console.log("out of stock")
      return toast.warning("out of stock")
    }

    setSelectedSize(size)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data: Product = await response.json();

        if (!Array.isArray(data.images)) {
          console.warn("Images are not an array. Check API response format.");
          data.images = [];
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found or API error.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  console.log(product?.sizes[0].stock)

  if (loading) return <Dots_v2 />;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const isShoes = product.category.toLowerCase() === "shoes";


  return (
    <>

      <div className="flex justify-center">

        <div className=" w-full  rounded-2xl bg-white flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
          <ProductImageSlider product={{ product_name: product.name, images: product.images }} />

          <div className="p-4 flex flex-col">
            <Breadcrumb />
            <h1 className="text-2xl font-bold mb-2">{product.productCode}</h1>
            <p className="text-gray-600 mb-4  lg:max-w-96">{product.description}</p>
            {product.discountPrice ? (
              <>
                <p className="text-lg font-bold line-through">৳ {product.price}</p>
                <p className="text-3xl font-bold">৳ {product.discountPrice}</p>
              </>
            ) : (
              <p className="text-3xl font-bold">৳ {product.price}</p>
            )}


            {/* Size Selection - Only for Shoes */}
            {isShoes && (
              <div className="mt-4">
                <p className="font-semibold text-xl">Select Size:</p>
                <div className="flex gap-2 mt-2">
                  {product.sizes
                    .slice()
                    .sort((a, b) => Number(a.size) - Number(b.size))
                    .map((size) => (
                      <button
                        key={size.id}
                        className={`px-3 py-1 border rounded-md text-xl transition-all duration-200 ${selectedSize?.id === size.id
                          ? "bg-black text-white border-black"
                          : size.stock > 0
                            ? "hover:bg-gray-200"
                            : "opacity-50 cursor-not-allowed"
                          }`}
                        // disabled={size.stock === 0}
                        onClick={() => noStock(size, size.stock)}
                      >
                        {size.size}
                      </button>
                    ))}
                </div>
              </div>
            )}


            {/* Quantity Selector */}
            <div className="flex items-center justify-start mt-4 gap-3">
              <label className="font-semibold text-xl">Quantity: </label>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8"
              >
                <Minus size={16} />
              </Button>
              <span className="text-lg font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const maxQuantity = isShoes
                    ? (selectedSize?.stock || 0)
                    : product.sizes.find(size => size.size === "Default")?.stock || 0;

                  if (quantity < maxQuantity) {
                    setQuantity((prev) => prev + 1);
                  }
                }}
                className="w-8 h-8"
              >
                <Plus size={16} />
              </Button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                variant="custom"
                onClick={() => {
                  if (isShoes && !selectedSize) {
                    toast.warning("Please select a size before adding to cart!");
                    return;
                  }

                  const bagDefaultSize = product.sizes.find(size => size.size === "Default");
                  const currentStock = isShoes
                    ? selectedSize?.stock
                    : bagDefaultSize?.stock;

                  if (quantity > (currentStock || 0)) {
                    toast.error("Not enough stock available.");
                    return;
                  }

                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.discountPrice ?? product.price,
                    image: product.images[0],
                    size: isShoes ? selectedSize?.size : "Default",
                    quantity,
                    category: product.category
                  });
                  toast.success("Added to cart!");
                }}
                size="lg"
                className="w-full mt-6 flex items-center gap-2"
              >
                <ShoppingCart size={16} /> ADD {quantity} TO CART
              </Button>

              <motion.div className="w-full">
                <Button
                  variant="custom"
                  size="lg"
                  className="w-full mt-6 flex items-center gap-2"
                  onClick={() => {
                    if (isShoes && !selectedSize) {
                      toast.warning("এগিয়ে যাওয়ার আগে একটি সাইজ নির্বাচন করুন।");
                      return;
                    }
                    router.push(
                      `/checkout?product=${product.id}${isShoes ? `&size=${selectedSize?.size}` : ''
                      }&quantity=${quantity}`
                    );
                  }}
                >
                  BUY NOW
                </Button>
              </motion.div>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p className="text-lg">
                <span className="font-semibold">Category:</span> {product.category}
              </p>
              <div className="text-lg flex">
                <span className="font-semibold">Stock:</span>
                {
                  isShoes ? selectedSize ? selectedSize.stock > 0 ? <p className="text-green-400 flex ml-2">In Stock <Check /></p> : <p>Out of Stock</p> : " Select a size" : ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <VelocityScroll>BagNStep</VelocityScroll>
      <RelatedProducts fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/products/related?category=${product.category}&exclude=${product.id}`} />
    </>
  );
}