"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedTabsProps = {
  tabs: { title: string }[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
};

export default function AnimatedTabs({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
}: AnimatedTabsProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-black rounded-full shadow-md",
        containerClassName
      )}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.title}
          onClick={() => setActiveIdx(index)}
          className={cn(
            "group relative z-[1] rounded-full px-4 py-2 sm:px-5 sm:py-2.5 transition-all duration-200",
            tabClassName
          )}
        >
          {activeIdx === index && (
            <motion.div
              layoutId="clicked-button"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "absolute inset-0 rounded-full bg-black dark:bg-white shadow-sm",
                activeTabClassName
              )}
            />
          )}

          <span
            className={cn(
              "relative z-10 text-sm font-medium whitespace-nowrap transition-colors duration-200",
              activeIdx === index
                ? "text-white dark:text-black"
                : "text-black dark:text-white"
            )}
          >
            {tab.title}
          </span>
        </button>
      ))}
    </div>
  );
}
