import type {
  CreateOrderResponse,
  OrderPayload,
  ProductDetails,
  User,
  MercadoPagoPreference,
  PaymentStatus,
  Order,
  Ktown4uOrderPayload,
  Ktown4uOrderResponse,
  ProductsListResponse,
} from "@/types/api";
import { MOCK_PRODUCTS } from "@/mocks/products";
import { mapProductListResponse, mapProductResponse } from "@/lib/products-mapper";

type FetchProductsParams = {
  type?: string;
  search?: string;
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  isActive?: boolean;
  sort?: string;
  releaseType?: "preOrder" | "newRelease";
};

type FetchJsonOptions = RequestInit & {
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10000;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
const MOCK_PAGE_SIZE = 12;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api";

function joinUrl(base: string, path: string): string {
  if (!base) return path;
  if (!path) return base;
  const baseHasSlash = base.endsWith("/");
  const pathHasSlash = path.startsWith("/");
  if (baseHasSlash && pathHasSlash) return `${base}${path.slice(1)}`;
  if (!baseHasSlash && !pathHasSlash) return `${base}/${path}`;
  return `${base}${path}`;
}


export async function fetchJson<T>(
  input: RequestInfo | URL,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  if (init.signal) {
    if (init.signal.aborted) controller.abort();
    else init.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(input, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      credentials: "include", // IMPORTANTE: enviar cookies JWT
      ...init,
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = `Erro HTTP ${res.status}`;
      try {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const body = (await res.json()) as { message?: string };
          if (body?.message) message = String(body.message);
        } else {
          const text = await res.text();
          if (text) message = text;
        }
      } catch {
        // ignore
      }
      throw new Error(message);
    }

    if (res.status === 204) return undefined as T;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(text ? `Resposta inválida: ${text}` : "Resposta inválida da API");
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Tempo de requisição excedido");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

// ============ PRODUTOS (Público) ============

export async function getProducts(params: FetchProductsParams = {}) {
  if (USE_MOCKS) {
    const search = (params.search ?? params.q)?.trim().toLowerCase();
    const category = params.type ?? params.category;
    let items = [...MOCK_PRODUCTS];
    if (category) items = items.filter((p) => p.category === category);
    if (search) items = items.filter((p) => p.name.toLowerCase().includes(search));

    const page = Math.max(params.page ?? 1, 1);
    const limit = params.limit ?? MOCK_PAGE_SIZE;
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const pageItems = items.slice(start, start + limit);

    return {
      items: pageItems,
      page: safePage,
      pageSize: limit,
      total,
      totalPages,
    } satisfies ProductsListResponse;
  }

  const sp = new URLSearchParams();
  const page =
    typeof params.page === "number" && Number.isFinite(params.page)
      ? Math.max(1, Math.floor(params.page))
      : undefined;
  const size =
    typeof params.limit === "number" && Number.isFinite(params.limit)
      ? Math.max(1, Math.floor(params.limit))
      : MOCK_PAGE_SIZE;
  const sort = typeof params.sort === "string" ? params.sort.trim() : "";
  const group = typeof params.search === "string" ? params.search.trim() : "";
  const kind = typeof params.type === "string" ? params.type.trim() : "";
  const groupFromQ = typeof params.q === "string" ? params.q.trim() : "";
  const kindFromCategory = typeof params.category === "string" ? params.category.trim() : "";

  if (page) sp.set("page", String(page));
  sp.set("size", String(size));
  if (sort) sp.set("sort", sort);
  if (group) sp.set("group", group);
  else if (groupFromQ) sp.set("group", groupFromQ);
  if (kind) sp.set("kind", kind);
  else if (kindFromCategory) sp.set("kind", kindFromCategory);
  if (params.releaseType) sp.set("releaseType", params.releaseType);

  const qs = sp.toString() ? `?${sp.toString()}` : "";
  const raw = await fetchJson<unknown>(joinUrl(API_BASE, `/products${qs}`));
  return mapProductListResponse(raw, size);
}

export async function getProductById(id: string) {
  if (USE_MOCKS) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    return product;
  }

  const raw = await fetchJson<unknown>(
    joinUrl(API_BASE, `/products/${encodeURIComponent(id)}`),
  );
  return mapProductResponse(raw);
}

export async function getProductDetails(goodsNo: string) {
  return fetchJson<ProductDetails>(
    joinUrl(API_BASE, `/products/${encodeURIComponent(goodsNo)}/details`),
  );
}

type ReserveProductPayload = {
  qty: number;
  customerName: string;
  email?: string;
  whatsapp?: string;
};

export async function reserveProduct(goodsNo: string, payload: ReserveProductPayload) {
  return fetchJson<{ id?: string; message?: string }>(
    joinUrl(API_BASE, `/products/${encodeURIComponent(goodsNo)}/reserve`),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

// ============ PEDIDOS ============

export async function createOrder(payload: OrderPayload) {
  return fetchJson<CreateOrderResponse>(`${API_BASE}/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createKtown4uOrder(payload: Ktown4uOrderPayload) {
  return fetchJson<Ktown4uOrderResponse>(`${API_BASE}/orders/ktown4u`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrderById(id: string) {
  return fetchJson<Order>(`${API_BASE}/orders/${encodeURIComponent(id)}`);
}

export async function getOrderByNumber(orderNumber: string) {
  return fetchJson<Order>(`${API_BASE}/orders/number/${encodeURIComponent(orderNumber)}`);
}

export async function getMyOrders() {
  return fetchJson<Order[]>(`${API_BASE}/orders/my-orders`);
}

// ============ PAGAMENTOS (Mercado Pago) ============

export async function createMercadoPagoPreference(orderId: string) {
  return fetchJson<MercadoPagoPreference>(`${API_BASE}/payments/mercadopago/preference`, {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function processMercadoPagoPayment(payload: Record<string, unknown>) {
  return fetchJson<{ status?: string; id?: string }>(
    `${API_BASE}/payments/mercadopago/payment`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function getPaymentStatus(orderId: string) {
  return fetchJson<PaymentStatus>(`${API_BASE}/payments/order/${encodeURIComponent(orderId)}`);
}

// ============ AUTENTICAÇÃO ============

export async function loginWithGoogle() {
  // Redireciona para a URL de login do backend
  window.location.href = `${API_BASE}/auth/google`;
}

export async function getCurrentUser() {
  try {
    return await fetchJson<User>(`${API_BASE}/auth/me`);
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      credentials: "include",
    });
  } catch {
    // ignore
  }
}
