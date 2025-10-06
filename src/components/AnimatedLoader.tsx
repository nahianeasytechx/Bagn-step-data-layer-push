// components/AnimatedLoader.tsx
"use client";
import { useEffect} from "react";
import { LettersPullUp } from "./LettersPullUp";
 // 👈 adjust path if needed

export default function AnimatedLoader({
  onFinish,
}: {
  onFinish: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // notify parent to hide loader
    }, 2000); // 3 seconds animation

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white z-50 fixed top-0 left-0">
      <LettersPullUp text="BagNStep" />
    </div>
  );
}
