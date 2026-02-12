import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag, ChevronLeft, Truck, ShieldCheck, Sparkles } from "lucide-react";

import { getProductById, getProductDetails } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import {
  getProductImages,
  getProductPriceCents,
  getProductTitle,
  getProductTypeLabel,
} from "@/lib/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/store/cart";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const goodsNo = useMemo(() => {
    const raw = typeof id === "string" ? id : "";
    const digits = raw.match(/\d+/g);
    return digits ? digits.join("") : "";
  }, [id]);

  const [qty, setQty] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", goodsNo],
    queryFn: () => getProductById(String(goodsNo)),
    enabled: Boolean(goodsNo),
  });
  const {
    data: details,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useQuery({
    queryKey: ["product-details", goodsNo],
    queryFn: () => getProductDetails(String(goodsNo)),
    enabled: Boolean(goodsNo),
  });

  useEffect(() => {
    if (!data?.variations?.length) return;
    if (selectedVariationId) return;
    const first = data.variations[0];
    const id = first.id ?? first.name;
    setSelectedVariationId(id);
  }, [data?.variations, selectedVariationId]);

  const safeQty = useMemo(() => Math.max(1, Math.min(99, qty)), [qty]);
  const selectedVariation = useMemo(() => {
    if (!data?.variations?.length || !selectedVariationId) return undefined;
    return data.variations.find(
      (v) => v.id === selectedVariationId || v.name === selectedVariationId
    );
  }, [data?.variations, selectedVariationId]);

  if (!goodsNo) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <div className="text-sm font-medium">Produto inválido.</div>
        <div className="mt-1 text-sm text-foreground/70">
          Não foi possível identificar o produto.
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

  const title = getProductTitle(data);
  const basePriceCents = getProductPriceCents(data);
  const basePriceLabel = formatBRL(basePriceCents / 100);
  const variationPrice =
    typeof selectedVariation?.priceCents === "number"
      ? formatBRL(selectedVariation.priceCents / 100)
      : typeof selectedVariation?.price === "number"
        ? formatBRL(selectedVariation.price)
        : null;
  const variationLabel =
    selectedVariation?.nameTranslated ?? selectedVariation?.name ?? null;
  const galleryImages = (() => {
    const images = getProductImages(data);
    const selectedImage = selectedVariation?.imageUrl;
    if (selectedImage && images.length) {
      const filtered = images.filter((img) => img !== selectedImage);
      return [selectedImage, ...filtered];
    }
    if (selectedImage) return [selectedImage];
    return images;
  })();

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
        <ProductGallery
          images={galleryImages}
          name={title}
          extra={
            <>
              {detailsLoading ? (
                <div className="text-xs text-foreground/50">Carregando detalhes…</div>
              ) : null}
              {detailsError ? (
                <div className="text-xs text-destructive">
                  Não foi possível carregar detalhes do produto.
                </div>
              ) : null}
              {details?.productContent ? (
                <div
                  className="text-sm leading-relaxed text-foreground/70"
                  dangerouslySetInnerHTML={{ __html: details.productContent }}
                />
              ) : null}
            </>
          }
        />

        <Card className="h-fit rounded-3xl border-border/60 bg-card/60 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-muted/40 text-foreground ring-1 ring-border/60">
              {getProductTypeLabel(data)}
            </Badge>
            <Badge className="rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
              destaque neon
            </Badge>
            {data.isPreorder ? (
              <Badge className="rounded-full bg-background/70 text-foreground ring-1 ring-border/60">
                pré-venda
              </Badge>
            ) : null}
            {selectedVariation?.nameTranslated ? (
              <Badge className="rounded-full bg-background/70 text-foreground ring-1 ring-border/60">
                {selectedVariation.nameTranslated}
              </Badge>
            ) : null}
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {title}
          </h1>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <div className="text-3xl font-semibold text-primary">
              {variationPrice ?? basePriceLabel}
            </div>
            {variationPrice ? (
              <div className="text-sm text-foreground/60">
                base {basePriceLabel}
              </div>
            ) : null}
            {data.priceText ? (
              <div className="text-sm text-foreground/60">{data.priceText}</div>
            ) : null}
          </div>

          <Separator className="my-6 bg-border/60" />

          {data.description ? (
            <p className="text-sm leading-relaxed text-foreground/70">{data.description}</p>
          ) : null}

          {data.variations?.length ? (
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-foreground/60">
                <span>VERSÕES</span>
                {variationLabel ? <span className="text-foreground/50">{variationLabel}</span> : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.variations.map((v) => {
                  const id = v.id ?? v.name;
                  const active = id === selectedVariationId;
                  const label = v.nameTranslated ?? v.name;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedVariationId(id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                        active
                          ? "border-primary/60 bg-primary/10 ring-1 ring-primary/20"
                          : "border-border/60 bg-muted/20 hover:bg-muted/30",
                      )}
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-xl border border-border/60 bg-muted/40">
                        {v.imageUrl ? (
                          <img src={v.imageUrl} alt={label} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{label}</div>
                        {v.nameOriginal && v.nameOriginal !== label ? (
                          <div className="truncate text-xs text-foreground/50">
                            {v.nameOriginal}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

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
                addItem(data, safeQty, selectedVariationId ?? undefined);
                toast({
                  title: "Adicionado ao carrinho",
                  description: `${safeQty}× ${title}${variationLabel ? ` • ${variationLabel}` : ""}`,
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

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Tipos de envio",
                body: "Envio nacional e importado com prazos diferentes.",
                icon: Truck,
              },
              {
                title: "Taxas e garantias",
                body: "Taxas aduaneiras podem variar conforme o método.",
                icon: ShieldCheck,
              },
              {
                title: "Brindes",
                body: "Brindes podem variar conforme o lote do produto.",
                icon: Sparkles,
              },
            ].map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className="rounded-2xl border border-border/60 bg-muted/20 p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary" />
                    {info.title}
                  </div>
                  <div className="mt-1 text-xs text-foreground/60">{info.body}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs text-foreground/70">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              CONDIÇÕES DE COMPRA
            </div>
            <div>
              TODAS AS TAXAS JÁ INCLUSAS: Frete internacional, taxa aduaneira e frete
              nacional já inclusos no valor pago no site. Comprando conosco, você não
              pagará nenhum valor a mais do que está sendo cobrado no site em nenhum
              momento da compra e/ou do envio.
            </div>
            <div>
              Prazo de entrega: de 20-40 dias corridos. Esse prazo começa a ser contado
              após a data de lançamento do produto.
            </div>
            <div>
              A pré-venda se encerra 24h antes da data de lançamento marcada no site.
              Brindes ou itens exclusivos concedidos ao período de pré-venda ficam
              suscetíveis a esgotar sem aviso prévio e, caso aconteça, serão reembolsados.
            </div>
            <div>
              Produto oficial e lacrado - não vendemos réplicas, todos os itens são
              garantidos diretamente de suas distribuidoras oficiais.
            </div>
            <div>
              Produto importado - enviado diretamente da Coréia do Sul, leia as páginas
              "Tipos de envio" e "Políticas da loja" para ter mais informações sobre
              frete e todas as logísticas de importação.
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs text-foreground/70">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              LEIA ANTES DE COMPRAR
            </div>
            <div>
              Leia nossas páginas informativas! Recomendamos a leitura das páginas
              "Tipos de envio" e "Políticas da loja" presente em nosso menu "Saiba mais"
              antes de concluir a sua compra para que você fique por dentro de como
              tudo por aqui funciona &lt;3
            </div>
            <div>
              Quando você receber seu rastreio, acompanhe-o! Encaminharemos o seu
              rastreio entre 7-15 dias úteis após seu pedido ser "Embalado", e é
              importantíssimo que você o acompanhe no app/site dos Correios para ficar
              ciente de todas as atualizações da sua encomenda!
            </div>
            <div>
              Atenção na sua compra! Informar endereço errado, informar dados
              diferentes do CPF e não pagar taxas caso sejam cobradas ou não retirar a
              encomenda nos Correios caso solicitem pode acarretar no extravio ou na
              devolução do produto e, nesses casos, teremos que cobrar taxas para
              reenvio, ok?
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
