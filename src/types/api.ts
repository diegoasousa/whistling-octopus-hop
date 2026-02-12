export type ProductType = "PHOTOCARD" | "LIGHTSTICK" | "ALBUM" | "MERCH" | "DOLL" | "OTHER";

export type ProductCategory = "lightsticks" | "photocards" | "bottons" | "acessorios" | string;

export type ProductImage = {
  id: string;
  url: string;
  position: number;
};

export type ProductVariation = {
  id?: string;
  name: string;
  imageUrl?: string;
  priceCents?: number;
  price?: number | null;
  stock?: number | null;
  nameOriginal?: string;
  nameTranslated?: string;
};

export type Product = {
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  description?: string;
  priceCents?: number; // converter para reais: priceCents / 100
  price?: number; // em reais, legado
  isPreorder?: boolean;
  type?: ProductType | string;
  category?: ProductCategory;
  imageUrl?: string;
  productUrl?: string;
  priceText?: string;
  images?: string[] | ProductImage[];
  variations?: ProductVariation[];
  isActive?: boolean;
  createdAt?: string; // ISO
  releaseDate?: string;
};

export type ProductsListResponse =
  | {
      items: Product[];
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    }
  | Product[];

export type CartItem = {
  productId: string;
  variationId?: string;
  name: string;
  price: number; // em reais
  image: string;
  type: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  variationId?: string;
  quantity: number;
};

export type OrderPayload = {
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocument?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
};

export type Ktown4uOrderItem = {
  goodsNo: string;
  variationId?: string;
  quantity: number;
};

export type Ktown4uOrderPayload = {
  items: Ktown4uOrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDocument?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
};

export type Ktown4uOrderResponse = {
  orderId: string;
};

export type CreateOrderResponse = {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalCents: number;
};

export type Order = CreateOrderResponse & {
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  createdAt: string;
};

export type OrderStatus = Order["status"];

// Mercado Pago
export type MercadoPagoPreference = {
  initPoint: string;
  sandboxInitPoint: string;
};

export type PaymentStatus = {
  orderId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  paymentId?: string;
  createdAt: string;
};

// Auth
export type User = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export type ProductDetails = {
  goodsNo: number;
  productNo?: number;
  productName?: string;
  productContent?: string;
  policy?: string;
  raw?: unknown;
  updatedAt?: string;
};
