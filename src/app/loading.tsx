"use client"
import DotsLoader from "@/components/DotsLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
      <DotsLoader />
      <p className="mt-4 font-body text-gray-600 text-lg"></p>
    </div>
  );
}
