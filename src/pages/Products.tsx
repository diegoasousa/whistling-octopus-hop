import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

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
import { toast } from "@/hooks/use-toast";

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

export default function ProductsPage() {
  const [sp, setSp] = useSearchParams();

  const initialPage = Math.max(Number(sp.get("page") ?? "1") || 1, 1);
  const sort = (sp.get("sort") ?? "recent") as SortMode;

  const queryParams = useMemo(() => {
    const category = sp.get("category") || undefined;
    const q = sp.get("q") || undefined;
    const minPrice = sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined;
    const maxPrice = sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined;
    return { category, q, minPrice, maxPrice };
  }, [sp]);

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
    setSp(next);
  }

  function clearAll() {
    setDraft({});
    setSp(new URLSearchParams());
  }

  function changeSort(nextSort: SortMode) {
    const next = new URLSearchParams(sp);
    next.set("sort", nextSort);
    setSp(next);
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
