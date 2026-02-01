import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, ChevronLeft } from "lucide-react";

import { fetchProduct } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import { categoryLabel } from "@/lib/catalog";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [qty, setQty] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(String(id)),
    enabled: Boolean(id),
  });

  const safeQty = useMemo(() => Math.max(1, Math.min(99, qty)), [qty]);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 bg-card/60 p-4">
          <Skeleton className="aspect-square w-full rounded-3xl" />
        </Card>
        <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/3" />
          <Skeleton className="mt-6 h-10 w-1/2" />
          <Skeleton className="mt-8 h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <div className="text-sm font-medium">Produto indisponível.</div>
        <div className="mt-1 text-sm text-foreground/70">
          {error instanceof Error ? error.message : "Tente novamente."}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="rounded-2xl" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button asChild className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/products">Ver produtos</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Button
        variant="ghost"
        className="-ml-2 rounded-full text-foreground/70 hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Voltar
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={data.images} name={data.name} />

        <Card className="h-fit rounded-3xl border-border/60 bg-card/60 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-muted/40 text-foreground ring-1 ring-border/60">
              {categoryLabel(data.category)}
            </Badge>
            <Badge className="rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
              destaque neon
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{data.name}</h1>

          <div className="mt-3 text-3xl font-semibold text-primary">
            {formatBRL(data.price)}
          </div>

          <Separator className="my-6 bg-border/60" />

          <p className="text-sm leading-relaxed text-foreground/70">{data.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-2xl border border-border/60 bg-muted/25 p-1">
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-2xl"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="min-w-12 text-center text-sm font-semibold">
                {safeQty}
              </div>
              <Button
                variant="ghost"
                className="h-10 w-10 rounded-2xl"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="h-12 flex-1 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                addItem(data, safeQty);
                toast({
                  title: "Adicionado ao carrinho",
                  description: `${safeQty}× ${data.name}`,
                });
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Adicionar ao carrinho
            </Button>
          </div>

          <Button asChild variant="secondary" className="mt-3 h-11 w-full rounded-2xl">
            <Link to="/cart">Ir para o carrinho</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
