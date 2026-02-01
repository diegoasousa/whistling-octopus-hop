import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Wand2, Image, Pin, KeyRound, ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

import { fetchProducts } from "@/lib/api";
import { CATEGORY_OPTIONS } from "@/lib/catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categoryIcon: Record<string, ComponentType<{ className?: string }>> = {
  lightsticks: Wand2,
  photocards: Image,
  bottons: Pin,
  acessorios: KeyRound,
};

export default function Index() {
  const featured = useQuery({
    queryKey: ["featured"],
    queryFn: () => fetchProducts({ page: 1 }),
  });

  const items = Array.isArray(featured.data)
    ? featured.data
    : featured.data?.items ?? [];

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-card/60 p-7 md:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[hsl(var(--brand-purple))] opacity-25 blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/25 px-3 py-1 text-xs font-semibold tracking-widest text-foreground/70">
              DARK STORE • K-POP VIBE
            </div>

            <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
              Produtos para o seu universo <span className="text-primary">fandom</span>,
              com estética neon.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
              Lightsticks, photocards colecionáveis, bottons e acessórios — tudo com nomes
              genéricos e sem marcas oficiais. Frontend pronto para integrar com seu backend.
            </p>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/products">
                  Explorar produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 rounded-2xl">
                <Link to="/products?sort=recent">Ver novidades</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { k: "API REST", v: "Consumo via /api/*" },
                { k: "Dark mode", v: "Padrão e mobile-first" },
                { k: "Reutilizável", v: "Componentes + Context" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
                >
                  <div className="text-xs font-semibold tracking-widest text-foreground/60">
                    {s.k}
                  </div>
                  <div className="mt-1 text-sm font-medium">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-[2rem] border-border/60 bg-card/60">
          <img
            src="/kpop-hero.svg"
            alt="Ilustração neon inspirada em cultura pop"
            className="h-full w-full object-cover"
          />
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Categorias</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Navegue rápido pelo que você coleciona.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden rounded-full text-foreground/70 md:inline-flex">
            <Link to="/products">Ver tudo</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_OPTIONS.map((c, idx) => {
            const Icon = categoryIcon[c.value];
            return (
              <Link key={c.value} to={`/products?category=${c.value}`} className="group">
                <Card
                  className={cn(
                    "rounded-3xl border-border/60 bg-card/60 p-5 transition hover:bg-card/80",
                    idx % 2 === 0 && "ring-1 ring-primary/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold tracking-wide">{c.label}</div>
                      <div className="mt-1 text-xs text-foreground/60">explorar agora</div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Destaques</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Uma seleção para começar sua coleção.
            </p>
          </div>
          <Button asChild variant="secondary" className="hidden rounded-2xl md:inline-flex">
            <Link to="/products">Ir para a vitrine</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="md:hidden">
          <Button asChild className="h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/products">Ver todos os produtos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}