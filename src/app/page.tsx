"use client";

import { useEffect, useRef } from "react";
import Products from "@/components/Products";
import { dataLayerPush } from "@/data/main";

export default function Home() {
  const pageViewPushed = useRef(false);

  useEffect(() => {
    // ✅ Prevent duplicate page_view events
    if (pageViewPushed.current) return;
    
    dataLayerPush("page_view");
    pageViewPushed.current = true;
    
    console.log("Page view event pushed for home page");
  }, []);

  return (
    <div >
      <Products/>
    </div>
  );
}