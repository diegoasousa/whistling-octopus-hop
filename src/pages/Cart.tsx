import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

import { useCart } from "@/store/cart";
import { formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-primary/15 ring-1 ring-primary/25">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Seu carrinho está vazio</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Adicione alguns itens para montar seu pedido.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/products">Explorar produtos</Link>
          </Button>
          <Button variant="secondary" className="h-11 rounded-2xl" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Carrinho</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Ajuste quantidades e finalize quando estiver pronto.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.productId}
              className="rounded-3xl border-border/60 bg-card/60 p-4"
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-border/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold tracking-wide">{item.name}</div>
                      <div className="mt-1 text-sm font-semibold text-primary">
                        {formatBRL(item.price)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-10 rounded-2xl text-foreground/70 hover:text-foreground"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-2xl border border-border/60 bg-muted/25 p-1">
                      <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-2xl"
                        onClick={() =>
                          setQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="min-w-12 text-center text-sm font-semibold">
                        {item.quantity}
                      </div>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-2xl"
                        onClick={() =>
                          setQuantity(item.productId, Math.min(99, item.quantity + 1))
                        }
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-foreground/70">
                      Total: <span className="font-semibold">{formatBRL(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="h-fit rounded-3xl border-border/60 bg-card/60 p-6">
        <div className="text-sm font-semibold tracking-wide">Resumo</div>
        <Separator className="my-4 bg-border/60" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Subtotal</span>
          <span className="font-semibold">{formatBRL(subtotal)}</span>
        </div>
        <div className="mt-2 text-xs text-foreground/55">
          Frete e pagamento serão calculados no backend.
        </div>

        <Button
          className="mt-6 h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate("/checkout")}
        >
          Finalizar compra
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <Button asChild variant="secondary" className="mt-2 h-11 w-full rounded-2xl">
          <Link to="/products">Continuar comprando</Link>
        </Button>
      </Card>
    </div>
  );
}
