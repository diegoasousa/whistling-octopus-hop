'use client';

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Link from "next/link";
import {
  Wand2,
  Image,
  Pin,
  KeyRound,
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import type { ComponentType } from "react";

import { getProducts } from "@/lib/api";
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

export default function HomePage() {
  const preOrdersQuery = useQuery({
    queryKey: ["home:preOrders"],
    queryFn: () => getProducts({ page: 1, limit: 8, releaseType: "preOrder" }),
  });
  const newReleasesQuery = useQuery({
    queryKey: ["home:newReleases"],
    queryFn: () => getProducts({ page: 1, limit: 8, releaseType: "newRelease" }),
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories:top"],
    queryFn: () => getProducts({ page: 1, limit: 200 }),
  });

  const preOrderItems = Array.isArray(preOrdersQuery.data)
    ? preOrdersQuery.data
    : preOrdersQuery.data?.items ?? [];
  const newReleaseItems = Array.isArray(newReleasesQuery.data)
    ? newReleasesQuery.data
    : newReleasesQuery.data?.items ?? [];
  const featuredCategories = useMemo(() => {
    const categoryItems = Array.isArray(categoriesQuery.data)
      ? categoriesQuery.data
      : categoriesQuery.data?.items ?? [];
    const counts = new Map<string, number>();
    for (const item of categoryItems) {
      const raw = (item.category ?? item.type) as string | undefined;
      const value = typeof raw === "string" ? raw.trim() : "";
      if (!value) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const list = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([value]) => ({ value, label: value }));

    return list.length ? list : CATEGORY_OPTIONS;
  }, [categoriesQuery.data]);

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
              K-POP VIBE
            </div>

            <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
              Produtos oficiais de <span className="text-primary">K-pop</span> com curadoria e entrega para todo o Brasil.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
              Álbuns, lightsticks e photocards selecionados com curadoria direta da cena
              global. Produtos oficiais, entrega para todo o Brasil.
            </p>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/products">
                  Explorar produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 rounded-2xl">
                <Link href="/products?sort=recent">Ver novidades</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { k: "Distribuição global", v: "Envio direto de fornecedores internacionais" },
                { k: "Pagamento facilitado", v: "Pix, cartão e parcelamento com confirmação imediata" },
                { k: "Produtos oficiais", v: "Itens válidos para charts e métricas" },
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
            src="/seoul-pulse-logo.png"
            alt="Logo Seoul Pulse"
            className="h-full w-full object-contain p-8"
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
            <Link href="/products">Ver tudo</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((c, idx) => {
            const Icon = categoryIcon[c.value] ?? Wand2;
            return (
              <Link key={c.value} href={`/products?category=${c.value}`} className="group">
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

      {preOrdersQuery.isLoading ? (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Pre-vendas</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Garanta os lançamentos antes de todo mundo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-3xl border-border/60 bg-card/60">
                <div className="aspect-square w-full animate-pulse bg-muted/30" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted/30" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted/30" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : preOrderItems.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Pre-vendas</h2>
              <p className="mt-1 text-sm text-foreground/70">
                Garanta os lançamentos antes de todo mundo.
              </p>
            </div>
            <Button asChild variant="secondary" className="hidden rounded-2xl md:inline-flex">
              <Link href="/products?releaseType=preOrder">Ver todas</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {preOrderItems.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="md:hidden">
            <Button asChild className="h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products?releaseType=preOrder">Ver todas as pre-vendas</Link>
            </Button>
          </div>
        </section>
      ) : null}

      {newReleasesQuery.isLoading ? (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Novos Lançamentos</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Os álbuns e produtos mais recentes do K-pop.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-3xl border-border/60 bg-card/60">
                <div className="aspect-square w-full animate-pulse bg-muted/30" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted/30" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted/30" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : newReleaseItems.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Novos Lançamentos</h2>
              <p className="mt-1 text-sm text-foreground/70">
                Os álbuns e produtos mais recentes do K-pop.
              </p>
            </div>
            <Button asChild variant="secondary" className="hidden rounded-2xl md:inline-flex">
              <Link href="/products?releaseType=newRelease">Ver todos</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newReleaseItems.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="md:hidden">
            <Button asChild className="h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products?releaseType=newRelease">Ver todos os lançamentos</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Saiba mais</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Tudo o que você precisa para comprar com confiança.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Tipos de envio",
              icon: Truck,
              href: "/policies/shipping",
              body: [
                "Envio internacional direto dos distribuidores.",
                "Taxas aduaneiras já inclusas no valor final.",
                "Prazos variam conforme o item e o lote.",
              ],
            },
            {
              title: "Políticas da loja",
              icon: ShieldCheck,
              href: "/policies",
              body: [
                "Regras de compra, prazos e responsabilidades do cliente.",
                "Dados e CPF corretos garantem o envio sem imprevistos.",
                "Taxas e rastreio seguem as normas de importação.",
              ],
            },
            {
              title: "Formas de pagamento",
              icon: CreditCard,
              body: [
                "Cartão de crédito em até 12x.",
                "PIX parcelado em até 4x sem juros.",
                "Boleto e transferência com desconto à vista.",
              ],
            },
          ].map((item) => {
            const Icon = item.icon;
            const card = (
              <Card
                key={item.title}
                className="rounded-3xl border-border/60 bg-card/60 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-semibold tracking-wide">{item.title}</div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-foreground/70">
                  {item.body.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </Card>
            );
            return item.href ? (
              <Link key={item.title} href={item.href} className="group">
                {card}
              </Link>
            ) : (
              card
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-card/60 p-7 md:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-[0.3]">
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[hsl(var(--brand-purple))] opacity-25 blur-3xl" />
          </div>
          <div className="relative space-y-4">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/25 px-3 py-1 text-xs font-semibold tracking-widest text-foreground/70">
              SOBRE NÓS
            </div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Seoul Pulse é a loja de quem leva a cultura K-pop a sério.
            </h2>
            <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
              Selecionamos cada produto com critério, informamos cada etapa do processo
              e garantimos uma experiência de compra clara, segura e conectada à cena original.
            </p>
            <p className="text-sm leading-relaxed text-foreground/70 md:text-base">
              Nosso foco é entregar uma experiência confiável, com suporte próximo e
              comunicação clara sobre prazos, pagamentos e envios.
            </p>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-[2rem] border-border/60 bg-card/60">
          <img
            src="/seoul-pulse-logo.png"
            alt="Logo Seoul Pulse"
            className="h-full w-full object-contain p-8"
          />
        </Card>
      </section>
    </div>
  );
}
