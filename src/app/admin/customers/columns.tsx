import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Order, OrderItem, Customer } from "@/types/types";
import { useRouter } from "next/navigation";
import { useDeleteCustomer } from "@/hooks/useDeleteCustomer";
import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// // Delete button component
// export function DeleteCustomerButton({ id }: { id: string }) {
//   const router = useRouter();
//   const { deleteCustomer, loading } = useDeleteCustomer();

//   const handleDelete = async () => {
//     const result = await deleteCustomer(id);

//     if (result.success) {
//       toast.success("Customer deleted");
//       router.refresh();
//     } else {
//       toast.error(result.error || "Failed to delete customer");
//     }
//   };

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button variant="destructive" disabled={loading}>
//           {loading ? "Deleting..." : "Delete"}
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete the customer and all of their orders.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={handleDelete} disabled={loading}>
//             Yes, Delete
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// View items button
function ViewItemsButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button size="sm" onClick={() => router.push(`/admin/customers/${id}`)}>
      View Items
    </Button>
  );
}

// Customer table columns
export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Customer Name",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    header: "Last Order Date",
    cell: ({ row }) => {
      const orders = row.original.orders;
      if (!orders || orders.length === 0) return "No Orders";

      const latest = orders
        .map((o: Order) => new Date(o.createdAt))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      return format(latest, "PPPp");
    },
  },
  {
    header: "Order History",
    cell: ({ row }) => {
      const orders = row.original.orders;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <ViewItemsButton id={row.original.id} />
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4 max-h-96 overflow-y-auto space-y-4">
            {orders.map((order: Order) => (
              <div key={order.id} className="border-b pb-2 last:border-none">
                <p className="text-sm font-semibold">Order ID: {order.id}</p>
                {order.items.map((item: OrderItem) => (
                  <div key={item.id} className="text-xs pl-4">
                    <p>Product: {item.product.name}</p>
                    <p>Size: {item.productSize?.size ?? "None"}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ৳ {item.price}</p>
                  </div>
                ))}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      );
    },
  },
  // {
  //   header: "Action",
  //   cell: ({ row }) => <DeleteCustomerButton id={row.original.id} />,
  // },
];
