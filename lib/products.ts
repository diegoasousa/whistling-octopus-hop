import type { Product, ProductImage } from "@/types/api";

export function getProductTitle(product: Product) {
  return product.title ?? product.name ?? "Produto";
}

export function getProductTypeLabel(product: Product) {
  return product.type ?? product.category ?? "Produto";
}

export function getProductPriceCents(product: Product) {
  if (typeof product.priceCents === "number") return product.priceCents;
  if (typeof product.price === "number") return Math.round(product.price * 100);
  return 0;
}

export function getSortedImageUrls(images?: Product["images"]) {
  if (!images || images.length === 0) return [];
  if (typeof images[0] === "string") return images as string[];
  return (images as ProductImage[])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((img) => img.url)
    .filter(Boolean);
}

export function getProductImages(product: Product) {
  const fromImages = getSortedImageUrls(product.images);
  if (fromImages.length) return fromImages;
  return product.imageUrl ? [product.imageUrl] : [];
}

export function getProductPrimaryImage(product: Product) {
  if (product.imageUrl) return product.imageUrl;
  return getProductImages(product)[0];
}

/**
 * Limpa o título do produto removendo códigos, IDs e caracteres especiais desnecessários
 * Exemplo: "[PRE-ORDER] BTS - Lightstick Ver.3 (12345)" → "BTS - Lightstick Ver.3"
 */
export function cleanProductTitle(title: string): string {
  return title
    .replace(/\[PRE-ORDER\]/gi, '') // Remove [PRE-ORDER]
    .replace(/\[PREORDER\]/gi, '') // Remove [PREORDER]
    .replace(/\(\d+\)/g, '') // Remove números entre parênteses (12345)
    .replace(/\s+\|\s+.*/g, '') // Remove tudo após pipes |
    .replace(/\s{2,}/g, ' ') // Remove espaços duplicados
    .trim(); // Remove espaços nas pontas
}
