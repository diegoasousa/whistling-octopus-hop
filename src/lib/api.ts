import type {
  CreateOrderPayload,
  CreateOrderResponse,
  Product,
  ProductsListResponse,
} from "@/types/api";

type FetchProductsParams = {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    let message = `Erro HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function fetchProducts(params: FetchProductsParams) {
  const qs = buildQuery({
    category: params.category,
    q: params.q,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    page: params.page ?? 1,
  });
  return fetchJson<ProductsListResponse>(`/api/products${qs}`);
}

export async function fetchProduct(id: string) {
  return fetchJson<Product>(`/api/products/${encodeURIComponent(id)}`);
}

export async function createOrder(payload: CreateOrderPayload) {
  return fetchJson<CreateOrderResponse>(`/api/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
