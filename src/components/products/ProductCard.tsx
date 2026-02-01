import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/types/api";
import { categoryLabel } from "@/lib/catalog";
import { formatBRL } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/60 bg-card/60 shadow-sm transition hover:bg-card/80">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          <AspectRatio ratio={1}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </AspectRatio>

          <div className="absolute left-3 top-3">
            <Badge className="rounded-full bg-background/70 text-foreground ring-1 ring-border/60 backdrop-blur">
              {categoryLabel(product.category)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="line-clamp-2 text-sm font-semibold tracking-wide">
            {product.name}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold text-primary">
              {formatBRL(product.price)}
            </div>
            <div className="text-xs text-foreground/60">ID: {product.id}</div>
          </div>
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
