'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SlidersHorizontal, ArrowUpDown, Clock, Sparkles, LayoutGrid } from "lucide-react";

import { getProducts } from "@/lib/api";
import type { Product, ProductsListResponse } from "@/types/api";
import { getProductPriceCents } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ProductFilters,
  type ProductFiltersValue,
} from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

type ReleaseTypeFilter = "all" | "preOrder" | "newRelease";

function normalizeProducts(resp: ProductsListResponse) {
  if (Array.isArray(resp)) {
    return {
      items: resp,
      page: 1,
      pageSize: resp.length,
      total: resp.length,
      totalPages: 1,
    };
  }
  return resp;
}

type SortMode = "recent" | "price_asc" | "price_desc";

function sortItems(items: Product[], sort: SortMode) {
  const copy = [...items];
  if (sort === "price_asc")
    return copy.sort((a, b) => getProductPriceCents(a) - getProductPriceCents(b));
  if (sort === "price_desc")
    return copy.sort((a, b) => getProductPriceCents(b) - getProductPriceCents(a));
  return copy.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

function spToDraft(sp: URLSearchParams): ProductFiltersValue {
  return {
    category: sp.get("category") || undefined,
    q: sp.get("q") || undefined,
    minPrice: sp.get("minPrice") || undefined,
    maxPrice: sp.get("maxPrice") || undefined,
  };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(searchParams?.toString() || ''), [searchParams]);

  const initialPage = Math.max(Number(sp.get("page") ?? "1") || 1, 1);
  const sort = (sp.get("sort") ?? "recent") as SortMode;
  const releaseTypeParam = sp.get("releaseType") as ReleaseTypeFilter | null;
  const releaseType: ReleaseTypeFilter = releaseTypeParam === "preOrder" || releaseTypeParam === "newRelease" ? releaseTypeParam : "all";

  const queryParams = useMemo(() => {
    const category = sp.get("category") || undefined;
    const q = sp.get("q") || undefined;
    const minPrice = sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined;
    const maxPrice = sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined;
    const rt = releaseType !== "all" ? releaseType : undefined;
    return { category, q, minPrice, maxPrice, releaseType: rt };
  }, [sp, releaseType]);

  const [draft, setDraft] = useState<ProductFiltersValue>(() => spToDraft(sp));

  useEffect(() => {
    setDraft(spToDraft(sp));
  }, [sp]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [sp]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", queryParams],
    initialPageParam: initialPage,
    queryFn: ({ pageParam }) => getProducts({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const normalized = normalizeProducts(lastPage);
      if (normalized.items.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const normalizedPages = useMemo(
    () => data?.pages.map(normalizeProducts) ?? [],
    [data?.pages],
  );
  const items = useMemo(() => {
    const merged = normalizedPages.flatMap((page) => page.items);
    const seen = new Set<string>();
    const unique = merged.filter((item) => {
      if (!item.id) return true;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    return sortItems(unique, sort);
  }, [normalizedPages, sort]);

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    const values: Array<{ value: string; label: string }> = [];
    for (const item of items) {
      const raw = (item.category ?? item.type) as string | undefined;
      const value = typeof raw === "string" ? raw.trim() : "";
      if (!value || seen.has(value)) continue;
      seen.add(value);
      values.push({ value, label: value });
    }
    return values;
  }, [items]);

  function applyDraft() {
    const next = new URLSearchParams(sp);
    const setOrDel = (key: string, value?: string) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    };

    setOrDel("category", draft.category);
    setOrDel("q", draft.q?.trim() ? draft.q.trim() : undefined);
    setOrDel("minPrice", draft.minPrice?.trim() ? draft.minPrice.trim() : undefined);
    setOrDel("maxPrice", draft.maxPrice?.trim() ? draft.maxPrice.trim() : undefined);

    next.set("page", "1");

    // Update URL using window.history.pushState for Next.js
    const newUrl = `${window.location.pathname}?${next.toString()}`;
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  }

  function clearAll() {
    setDraft({});
    window.history.pushState({}, '', window.location.pathname);
    window.location.reload();
  }

  function changeSort(nextSort: SortMode) {
    const next = new URLSearchParams(sp);
    next.set("sort", nextSort);
    const newUrl = `${window.location.pathname}?${next.toString()}`;
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  }

  function changeReleaseType(value: ReleaseTypeFilter) {
    const next = new URLSearchParams(sp);
    if (value === "all") {
      next.delete("releaseType");
    } else {
      next.set("releaseType", value);
    }
    next.set("page", "1");
    const newUrl = `${window.location.pathname}?${next.toString()}`;
    window.history.pushState({}, '', newUrl);
    window.location.reload();
  }

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (isFetchingNextPage || isFetching) return;
        fetchNextPage();
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
            <p className="mt-1 text-sm text-foreground/70">
              Lightsticks, cards, bottons e acessórios — tudo no mood neon.
            </p>
          </div>

          <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" className="rounded-2xl md:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[340px] bg-background">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductFilters
                  value={draft}
                  onChange={setDraft}
                  onApply={applyDraft}
                  onClear={clearAll}
                  options={categoryOptions.length ? categoryOptions : undefined}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 md:flex-none">
            <Select value={sort} onValueChange={(v) => changeSort(v as SortMode)}>
              <SelectTrigger className="h-10 w-full rounded-2xl border-border/60 bg-muted/25 md:w-[220px]">
                <ArrowUpDown className="mr-2 h-4 w-4 text-foreground/60" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="price_asc">Menor preço</SelectItem>
                <SelectItem value="price_desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>

        <Tabs value={releaseType} onValueChange={(v) => changeReleaseType(v as ReleaseTypeFilter)}>
          <TabsList className="h-11 rounded-2xl bg-muted/25 p-1">
            <TabsTrigger value="all" className="rounded-xl px-4 data-[state=active]:bg-background">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Todos
            </TabsTrigger>
            <TabsTrigger value="preOrder" className="rounded-xl px-4 data-[state=active]:bg-background">
              <Clock className="mr-2 h-4 w-4" />
              Pre-vendas
            </TabsTrigger>
            <TabsTrigger value="newRelease" className="rounded-xl px-4 data-[state=active]:bg-background">
              <Sparkles className="mr-2 h-4 w-4" />
              Novos Lançamentos
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <Card className="hidden h-fit rounded-3xl border-border/60 bg-card/60 p-5 md:block">
          <ProductFilters
            value={draft}
            onChange={setDraft}
            onApply={applyDraft}
            onClear={clearAll}
            options={categoryOptions.length ? categoryOptions : undefined}
          />
        </Card>

        <div className="space-y-4">
          {isError ? (
            <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
              <div className="text-sm font-medium">Não foi possível carregar os produtos.</div>
              <div className="mt-1 text-sm text-foreground/70">
                {error instanceof Error ? error.message : "Tente novamente."}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    refetch();
                    toast({ title: "Recarregando…" });
                  }}
                >
                  Tentar novamente
                </Button>
                <Button variant="secondary" className="rounded-2xl" onClick={clearAll}>
                  Limpar filtros
                </Button>
              </div>
            </Card>
          ) : null}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 12 }).map((_, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden rounded-3xl border-border/60 bg-card/60"
                  >
                    <Skeleton className="aspect-square w-full" />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full rounded-2xl" />
                    </div>
                  </Card>
                ))
              : items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div ref={loadMoreRef} className="h-1" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
