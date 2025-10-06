export type Size = {
    id: string;
    productId: string;
    size: string;
    stock: number;
  };

  
  export interface ProductSize {
    id: string;
    size: string;
    stock: number;
  }
  
//product props
export interface Product {
    id: string;
    name: string;
    productCode: string;
    description?: string;
    price: number;
    discountPrice ?: number;
    stock: number;
    category: string;
    images: string[];
    sizes: ProductSize[];
  }

  // product card simplified props
  export type ProductCardProps = {
    id: string;
    name: string;
    productCode: string;
    images: string[];
    price: number;
    discountPrice?: number;
    category: string;
    sizes: ProductSize[];
  };

  //cart item props

  export interface CartItem {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
    quantity: number;
    size?: string | null;
    productId: string
    category?: string; // Add this line
  }
  

  export type OrderItem = {
    id: string;
    quantity: number;
    price: number;
    discountPrice: number;
    product: {
      id?: string;
      name: string;
      productCode: string;
      images: string[];
    };
    productSize?: {
      size: string;
    };
  };
  
  export interface Order {
    id: string;
    status: string;
    totalAmount: number;
    note?: string;
    shippingCost: number;
    createdAt: string;
    customer: {
      name: string;
      phone: string;
      address?: string;
    };
    items: {
      id: string;

      quantity: number;
      price: number;
      discountPrice: number;
      product: {
        name: string;
        productCode: string;
        images: string[];
      };
      productSize: {
        size: string;
      };
    }[];
  }
  

  export type Customer = {
    id: string
    name: string
    email: string
    phone: string
    orderCount: number
    createdAt: Date
    lastOrderDate?: Date
    orders:[]
  }