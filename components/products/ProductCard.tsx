'use client';

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/types/api";
import { formatBRL } from "@/lib/format";
import {
  getProductPrimaryImage,
  getProductPriceCents,
  getProductTitle,
  getProductTypeLabel,
} from "@/lib/products";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const title = getProductTitle(product);
  const priceCents = getProductPriceCents(product);
  const image = getProductPrimaryImage(product);
  const typeLabel = getProductTypeLabel(product);

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-card/60 shadow-sm transition hover:bg-card/80">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative">
          <AspectRatio ratio={1}>
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/30 text-xs text-foreground/60">
                Sem imagem
              </div>
            )}
          </AspectRatio>

          <div className="absolute left-3 top-3 flex gap-1.5">
            <Badge className="rounded-full bg-background/70 text-foreground ring-1 ring-border/60 backdrop-blur">
              {typeLabel}
            </Badge>
            {product.releaseType === "preOrder" && (
              <Badge className="rounded-full bg-amber-500/90 text-white backdrop-blur">
                PRE-VENDA
              </Badge>
            )}
            {product.releaseType === "newRelease" && (
              <Badge className="rounded-full bg-emerald-500/90 text-white backdrop-blur">
                NOVO
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="line-clamp-2 text-sm font-semibold tracking-wide">
            {title}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold text-primary">
                {formatBRL(priceCents / 100)}
              </div>
              <div className="text-xs text-foreground/60">
                {product.isPreorder ? "Pré-venda • " : ""}
                ID: {product.id}
              </div>
            </div>
            <div className="text-xs text-foreground/50">
              em até 10x de {formatBRL(priceCents / 100 / 10)}
            </div>
            {product.pixPriceCents ? (
              <div className="text-xs font-medium text-emerald-400">
                ou {formatBRL(product.pixPriceCents / 100)} no PIX/Boleto
              </div>
            ) : null}
          </div>
          {product.variations?.length ? (
            <div className="space-y-1 text-xs text-foreground/70">
              {product.variations.map((v) => (
                <div key={v.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{v.name}</span>
                  {typeof v.priceCents === "number" ? (
                    <span className="shrink-0">{formatBRL(v.priceCents / 100)}</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          className="h-10 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => addItem(product, 1)}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>
    </Card>
  );
}
