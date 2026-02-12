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
