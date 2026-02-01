export type ProductCategory =
  | "lightsticks"
  | "photocards"
  | "bottons"
  | "acessorios";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  createdAt: string; // ISO
};

export type ProductsListResponse =
  | Product[]
  | {
      items: Product[];
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };

export type CreateOrderPayload = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export type CreateOrderResponse = {
  id: string;
  status: "created" | "paid" | "processing" | "shipped";
};
