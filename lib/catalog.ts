import type { ProductCategory } from "@/types/api";

export const CATEGORY_OPTIONS: Array<{
  value: ProductCategory;
  label: string;
}> = [
  { value: "lightsticks", label: "Lightsticks" },
  { value: "photocards", label: "Photocards" },
  { value: "bottons", label: "Bottons" },
  { value: "acessorios", label: "Acessórios" },
];

export function categoryLabel(category: ProductCategory) {
  return CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? category;
}
