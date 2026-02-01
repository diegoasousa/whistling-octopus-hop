import type { CreateOrderPayload, Product, ProductCategory } from "@/types/api";

const PAGE_SIZE = 12;

type ProductsResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function svgDataUri(opts: {
  title: string;
  hue: number;
  subHue: number;
}) {
  const { title, hue, subHue } = opts;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <rect width="900" height="900" rx="64" fill="hsl(${hue} 50% 10%)"/>
  <circle cx="760" cy="140" r="120" fill="hsl(${subHue} 90% 55%)" opacity="0.18"/>
  <circle cx="120" cy="720" r="180" fill="hsl(${(subHue + 45) % 360} 90% 60%)" opacity="0.12"/>
  <path d="M80 260 C 220 160, 340 380, 480 280 S 740 380, 820 260" fill="none" stroke="hsl(${subHue} 90% 60%)" stroke-width="10" opacity="0.6"/>
  <text x="80" y="520" font-size="52" font-family="ui-sans-serif, system-ui" fill="hsl(0 0% 96%)" letter-spacing="1.2">${escapeXml(title)}</text>
  <text x="80" y="585" font-size="24" font-family="ui-sans-serif, system-ui" fill="hsl(0 0% 80%)" opacity="0.9">Edição neon • estética fandom</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const CATEGORY: Array<{ cat: ProductCategory; seed: number }> = [
  { cat: "lightsticks", seed: 11 },
  { cat: "photocards", seed: 22 },
  { cat: "bottons", seed: 33 },
  { cat: "acessorios", seed: 44 },
];

function buildCatalog(): Product[] {
  const now = Date.now();
  const all: Product[] = [];

  for (const { cat, seed } of CATEGORY) {
    const rand = mulberry32(seed);
    for (let i = 0; i < 14; i++) {
      const base = Math.floor(rand() * 1000);
      const hue = Math.floor(rand() * 360);
      const subHue = (hue + 280) % 360;
      const id = `${cat}-${base}-${i}`;

      const name =
        cat === "lightsticks"
          ? `Lightstick Neon ${i + 1}`
          : cat === "photocards"
            ? `Photocard Colecionável ${i + 1}`
            : cat === "bottons"
              ? `Botton Fandom ${i + 1}`
              : `Acessório Mini ${i + 1}`;

      const price =
        cat === "lightsticks"
          ? 169 + Math.round(rand() * 180)
          : cat === "photocards"
            ? 19 + Math.round(rand() * 50)
            : cat === "bottons"
              ? 9 + Math.round(rand() * 25)
              : 29 + Math.round(rand() * 70);

      const createdAt = new Date(
        now - (i * 86400000 + Math.round(rand() * 6) * 3600000),
      ).toISOString();

      const images = [
        svgDataUri({ title: name, hue, subHue }),
        svgDataUri({ title: `${name} • Close`, hue: (hue + 16) % 360, subHue }),
        svgDataUri({
          title: `${name} • Detalhes`,
          hue: (hue + 32) % 360,
          subHue: (subHue + 12) % 360,
        }),
      ];

      all.push({
        id,
        name,
        description:
          "Produto inspirado na cultura K-pop e no universo fandom. Acabamento premium, visual neon e detalhes pensados para colecionadores.",
        price,
        category: cat,
        images,
        createdAt,
      });
    }
  }

  // newest first by default
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

const CATALOG = buildCatalog();

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

function parseNumber(v: string | null) {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

async function delay(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export function enableMockApi() {
  if (typeof window === "undefined") return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const method = (init?.method ?? "GET").toUpperCase();

    // Only mock same-origin /api/* calls
    if (!url.startsWith("/api/")) {
      return originalFetch(input, init);
    }

    await delay(380);

    try {
      // GET /api/products
      if (method === "GET" && url.startsWith("/api/products")) {
        const u = new URL(url, window.location.origin);

        // GET /api/products/:id
        const match = u.pathname.match(/^\/api\/products\/(.+)$/);
        if (match) {
          const id = decodeURIComponent(match[1]);
          const product = CATALOG.find((p) => p.id === id);
          if (!product)
            return jsonResponse({ message: "Produto não encontrado" }, { status: 404 });
          return jsonResponse(product);
        }

        const category = u.searchParams.get("category") || undefined;
        const q = (u.searchParams.get("q") || "").trim().toLowerCase();
        const minPrice = parseNumber(u.searchParams.get("minPrice"));
        const maxPrice = parseNumber(u.searchParams.get("maxPrice"));
        const page = Math.max(parseNumber(u.searchParams.get("page")) ?? 1, 1);

        let items = [...CATALOG];
        if (category) items = items.filter((p) => p.category === category);
        if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
        if (minPrice !== undefined) items = items.filter((p) => p.price >= minPrice);
        if (maxPrice !== undefined) items = items.filter((p) => p.price <= maxPrice);

        const total = items.length;
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * PAGE_SIZE;
        const pageItems = items.slice(start, start + PAGE_SIZE);

        const response: ProductsResponse = {
          items: pageItems,
          page: safePage,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
        };

        return jsonResponse(response);
      }

      // POST /api/orders
      if (method === "POST" && url === "/api/orders") {
        const raw = init?.body ? JSON.parse(String(init.body)) : undefined;
        const payload = raw as CreateOrderPayload;

        if (!payload?.customer?.name || !payload?.customer?.email || !payload?.items?.length) {
          return jsonResponse({ message: "Pedido inválido" }, { status: 400 });
        }

        return jsonResponse({
          id: `ord_${Math.random().toString(16).slice(2)}`,
          status: "created" as const,
        });
      }

      return jsonResponse({ message: "Endpoint não mockado" }, { status: 404 });
    } catch (e) {
      return jsonResponse(
        { message: e instanceof Error ? e.message : "Erro inesperado" },
        { status: 500 },
      );
    }
  };
}