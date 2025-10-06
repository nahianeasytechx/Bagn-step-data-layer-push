import { Suspense } from "react";
import CheckoutPageContent from  "@/components/CheckoutPageContent"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p>Loading checkout...</p>}>
      <CheckoutPageContent />
    </Suspense>
  );
}