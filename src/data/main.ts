// Define item structure for dataLayer events
export interface DataLayerItem {
  code?: string | number;
  name?: string;
  price?: number;
  quantity?: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  variant?: string;
}

// Define the allowed event types
export type DataLayerEventType =
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "add_to_wishlist"
  | "remove_from_wishlist"
  | "begin_checkout"
  | "purchase"
  | "page_view"
  | "custom_event";

// Extend the window object type to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Push eCommerce events into Google Tag Manager dataLayer
 * Handles both single and multiple item objects
 */
export function dataLayerPush(
  eventType: DataLayerEventType,
  items?: DataLayerItem | DataLayerItem[]
): void {
  const validEvents: DataLayerEventType[] = [
    "view_item",
    "add_to_cart",
    "remove_from_cart",
    "view_cart",
    "add_to_wishlist",
    "remove_from_wishlist",
    "begin_checkout",
    "purchase",
    "page_view"
  ];

  const event: DataLayerEventType = validEvents.includes(eventType)
    ? eventType
    : "custom_event";

  // Ensure dataLayer exists
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];

  // Handle special page_view event
  if (event === "page_view") {
    window.dataLayer.push({
      event: "page_view",
      page: {
        page_path: window.location.pathname,
        page_title: document.title,
        page_location: window.location.href
      }
    });

    console.log("Data Layer Push: page_view", {
      path: window.location.pathname,
      title: document.title,
      url: window.location.href
    });
    return;
  }

  // Normalize single vs multiple items
  const normalizedItems: DataLayerItem[] = Array.isArray(items) ? items : items ? [items] : [];

  const ecommerceItems = normalizedItems.map((itemData) => ({
    item_id: itemData.code ?? "",
    item_name: itemData.name ?? "",
    price: Number(itemData.price) || 0,
    quantity: Number(itemData.quantity) || 1,
    item_category: itemData.category ?? "",
    item_category2: itemData.subCategory ?? "",
    item_brand: itemData.brand ?? "",
    item_variant: itemData.variant ?? ""
  }));

  window.dataLayer.push({
    event,
    ecommerce: {
      currency: "BDT",
      items: ecommerceItems
    }
  });

  console.log("Data Layer Push:", event, ecommerceItems);
}
