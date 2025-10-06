// InfoCardList.tsx
"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { Customer } from "@/types/types"
import { useRouter } from "next/navigation";


interface InfoCardListProps {
  customers: Customer[];
}

export default function InfoCardList({ customers }: InfoCardListProps) {

  const router= useRouter()

  return (
    <div className="space-y-6 md:hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader />
            <CardContent className="flex flex-col">
              <p className="text-xl font-semibold">Customer name: {customer.name}</p>
              <p className="text-xl font-semibold">Number: {customer.phone}</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => router.push(`/admin/customers/${customer.id}`)} size="lg">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <p className="text-center text-muted-foreground">No customers found.</p>
      )}
    </div>
  )
}
