import type { Product, ProductsListResponse } from "@/types/api";

export type ProductDTO = {
  id?: string;
  source?: string;
  goodsNo: number;
  shopNo?: number;
  groupName?: string;
  grpNm?: string;
  name: string;
  kind?: string;
  releaseDate?: string;
  isAdult?: boolean;
  sale?: boolean;
  price?: { currency: string; amount: number; originalAmount?: number };
  images?: { thumb?: string; t1?: string; t2?: string };
  categoryPath?: string;
  updatedAt?: string;
  imgPath?: string;
  raw?: unknown;
  isPreorder?: boolean;
  [key: string]: unknown;
};

type ProductListEnvelope = {
  items?: unknown;
  list?: unknown;
  data?: unknown;
  page?: unknown;
  pageNo?: unknown;
  pageNumber?: unknown;
  size?: unknown;
  pageSize?: unknown;
  total?: unknown;
  totalCount?: unknown;
  totalPages?: unknown;
  pages?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function pickString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") return undefined;
  return trimmed;
}

function formatDatePtBr(value?: string): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  try {
    return parsed.toLocaleDateString("pt-BR");
  } catch {
    return undefined;
  }
}

function isFutureDate(value?: string): boolean {
  if (!value) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  return target.getTime() > today.getTime();
}

const USD_TO_BRL = (() => {
  const raw = process.env.NEXT_PUBLIC_USD_TO_BRL;
  if (typeof raw === "string" && raw.trim()) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return undefined;
})();

function computeFinalPriceBrlFromUsd(amountUsd: number): number {
  if (!USD_TO_BRL) {
    console.warn("NEXT_PUBLIC_USD_TO_BRL not set. Using USD amount as BRL.");
  }
  const rate = USD_TO_BRL ?? 1;
  const envioUsd = Number(process.env.NEXT_PUBLIC_ENVIO);
  const baseBrl = (amountUsd + envioUsd) * rate;
  const taxa = 0.6 * baseBrl;
  const margem = 0.05 * (baseBrl + taxa);
  const subtotal = baseBrl + taxa + margem;
  // Absorb MercadoPago 5% fee: divide by 0.95 so net received = subtotal
  const total = subtotal / 0.95;
  // Round up to next multiple of 5, minus 1 cent
  const rounded = Math.ceil(total / 5) * 5 - 0.01;
  return Math.max(0, rounded);
}

function roundPriceToFiveEnding(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const rounded = Math.ceil(amount / 5) * 5 - 0.01;
  return Math.max(0, rounded);
}

function toStringId(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") return String(value);
  return undefined;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizePriceCents(value: unknown): number | undefined {
  const n = toNumber(value);
  if (n === undefined) return undefined;
  if (!Number.isFinite(n)) return undefined;
  if (Number.isInteger(n) && n >= 1000) return n;
  return Math.round(n * 100);
}

function extractImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const urls: string[] = [];
  for (const entry of value) {
    if (typeof entry === "string") {
      const normalized = normalizeString(entry);
      if (normalized) urls.push(normalized);
      continue;
    }
    if (isRecord(entry)) {
      const url = pickString(entry.url, entry.imageUrl, entry.src, entry.path);
      if (url) urls.push(url);
    }
  }
  return urls;
}

function mapProductDto(dto: ProductDTO): Product {
  const goodsNo = toStringId(dto.goodsNo);
  const id =
    goodsNo ??
    toStringId(
      dto.id ??
        dto["goods_no"] ??
        dto["goods_id"] ??
        dto["product_id"] ??
        dto.sku ??
        dto.code,
    ) ??
    "";

  const name =
    pickString(
      dto.name,
      dto.title,
      dto.goodsNm,
      dto.goodsName,
      dto.goodsTitle,
      dto.goodsNmEn,
      dto.goodsNmKor,
    ) ??
    "Produto";

  const artist = pickString(
    dto.groupName,
    dto.grpNm,
    dto.artist,
    dto.artistName,
    dto.group,
    dto.band,
    dto.brand,
    dto.company,
    dto.label,
  );

  const typeLabel = pickString(
    dto.kind,
    dto.type,
    dto.category,
    dto.goodsType,
    dto.goodsTypeName,
    dto.categoryName,
  );

  const priceAmount = toNumber(dto.price?.amount);
  const originalAmount = toNumber(dto.price?.originalAmount);
  const effectiveAmount = originalAmount ?? priceAmount;
  const currency = normalizeString(dto.price?.currency) ?? "USD";
  const brlAmount =
    typeof effectiveAmount === "number" && currency.toUpperCase() === "USD"
      ? computeFinalPriceBrlFromUsd(effectiveAmount)
      : effectiveAmount;
  const roundedBrlAmount =
    typeof brlAmount === "number" ? roundPriceToFiveEnding(brlAmount) : brlAmount;
  const priceCents =
    (typeof roundedBrlAmount === "number"
      ? Math.round(roundedBrlAmount * 100)
      : undefined) ??
    normalizePriceCents(dto.priceCents) ??
    normalizePriceCents(dto.salePriceCents) ??
    normalizePriceCents(dto.salePrice) ??
    normalizePriceCents(dto.price) ??
    normalizePriceCents(dto.goodsPrice) ??
    undefined;

  const imageUrl = normalizeString(
    pickString(
      dto.images?.thumb,
      dto.images?.t1,
      dto.images?.t2,
      dto.imgPath,
      dto.imageUrl,
      dto.image,
      dto.thumbnail,
      dto.thumb,
      dto.mainImage,
      dto.mainImageUrl,
      dto.coverImage,
      dto.goodsImage,
      dto.goodsImg,
    ),
  );

  const imagesCandidate = [
    imageUrl ? [imageUrl] : [],
    extractImageUrls(dto.images),
    extractImageUrls(dto.imageUrls),
    extractImageUrls(dto.gallery),
    extractImageUrls(dto.detailImages),
  ];
  const images = imagesCandidate.find((list) => list.length > 0) ?? [];

  const releaseDate = pickString(
    dto.releaseDate,
    dto["release_date"],
    dto.releaseAt,
    dto.launchDate,
    dto.openDate,
    dto["open_date"],
  );

  if (!id) {
    // Defensive logging for unexpected payloads
    console.warn("Product without goodsNo/id", dto);
  }

  const releaseDateLabel = formatDatePtBr(releaseDate);
  const computedPreorder = isFutureDate(releaseDate);

  return {
    id,
    name,
    title: name,
    description: pickString(dto.description, dto.detail, dto.contents, dto.goodsDesc),
    priceCents,
    price: typeof roundedBrlAmount === "number" ? roundedBrlAmount : undefined,
    isPreorder: typeof dto.isPreorder === "boolean" ? dto.isPreorder : computedPreorder,
    type: artist ?? typeLabel,
    category: typeLabel,
    imageUrl,
    images: images.length ? images : imageUrl ? [imageUrl] : undefined,
    isActive: dto.isActive === undefined ? true : Boolean(dto.isActive),
    createdAt: pickString(dto.createdAt, dto["created_at"], dto.registerDate, dto.regDt),
    priceText: releaseDateLabel ? `Lançamento em ${releaseDateLabel}` : undefined,
    releaseDate,
    artist,
    releaseType:
      dto.releaseType === "preOrder" || dto.releaseType === "newRelease"
        ? dto.releaseType
        : null,
    sortOrder: typeof dto.sortOrder === "number" ? dto.sortOrder : null,
  } satisfies Product;
}

function extractListEnvelope(raw: unknown): {
  items: ProductDTO[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
} {
  if (Array.isArray(raw)) {
    return { items: raw as ProductDTO[] };
  }

  if (!isRecord(raw)) {
    return { items: [] };
  }

  const envelope = raw as ProductListEnvelope;

  const nested = isRecord(envelope.data) ? (envelope.data as ProductListEnvelope) : undefined;

  const listCandidate =
    (Array.isArray(envelope.items) ? envelope.items : undefined) ??
    (Array.isArray(envelope.list) ? envelope.list : undefined) ??
    (Array.isArray(envelope.data) ? envelope.data : undefined) ??
    (nested && Array.isArray(nested.items) ? nested.items : undefined) ??
    (nested && Array.isArray(nested.list) ? nested.list : undefined);

  const page =
    toNumber(envelope.page) ??
    toNumber(envelope.pageNo) ??
    toNumber(envelope.pageNumber) ??
    (nested ? toNumber(nested.page) ?? toNumber(nested.pageNo) ?? toNumber(nested.pageNumber) : undefined);

  const pageSize =
    toNumber(envelope.size) ??
    toNumber(envelope.pageSize) ??
    (nested ? toNumber(nested.size) ?? toNumber(nested.pageSize) : undefined);

  const total =
    toNumber(envelope.total) ??
    toNumber(envelope.totalCount) ??
    (nested ? toNumber(nested.total) ?? toNumber(nested.totalCount) : undefined);

  const totalPages =
    toNumber(envelope.totalPages) ??
    toNumber(envelope.pages) ??
    (nested ? toNumber(nested.totalPages) ?? toNumber(nested.pages) : undefined);

  return {
    items: (listCandidate ?? []) as ProductDTO[],
    page: page ?? undefined,
    pageSize: pageSize ?? undefined,
    total: total ?? undefined,
    totalPages: totalPages ?? undefined,
  };
}

export function mapProductListResponse(raw: unknown, fallbackPageSize = 12): ProductsListResponse {
  const envelope = extractListEnvelope(raw);
  const items = envelope.items.map(mapProductDto);
  const page = envelope.page ?? 1;
  const pageSize = envelope.pageSize ?? fallbackPageSize;
  const total = envelope.total ?? items.length;
  const totalPages = envelope.totalPages ?? Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
  } satisfies ProductsListResponse;
}

export function mapProductResponse(raw: unknown): Product {
  if (isRecord(raw)) return mapProductDto(raw as ProductDTO);
  return {
    id: "",
    name: "Produto",
    title: "Produto",
  } satisfies Product;
}
