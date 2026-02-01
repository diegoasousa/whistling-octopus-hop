import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";

import { createOrder } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  line1: z.string().min(4, "Endereço inválido"),
  line2: z.string().optional(),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().min(2, "Estado inválido"),
  zip: z.string().min(5, "CEP inválido"),
  country: z.string().min(2).default("BR"),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [successId, setSuccessId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "BR",
    },
    mode: "onTouched",
  });

  const payload = useMemo(() => {
    const v = form.getValues();
    return {
      customer: {
        name: v.name,
        email: v.email,
        phone: v.phone,
        address: {
          line1: v.line1,
          line2: v.line2,
          city: v.city,
          state: v.state,
          zip: v.zip,
          country: v.country,
        },
      },
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };
  }, [form, items]);

  const mutation = useMutation({
    mutationFn: () => createOrder(payload),
    onSuccess: (res) => {
      setSuccessId(res.id);
      clear();
      toast({
        title: "Pedido enviado!",
        description: `ID do pedido: ${res.id}`,
      });
    },
    onError: (e) => {
      toast({
        title: "Não foi possível enviar o pedido",
        description: e instanceof Error ? e.message : "Tente novamente.",
        variant: "destructive",
      });
    },
  });

  if (!items.length && !successId) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-8 text-center">
        <div className="text-sm font-medium">Seu carrinho está vazio.</div>
        <p className="mt-2 text-sm text-foreground/70">
          Volte para a vitrine e escolha seus itens.
        </p>
        <Button asChild className="mt-6 h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/products">Ir para produtos</Link>
        </Button>
      </Card>
    );
  }

  if (successId) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/15 ring-1 ring-primary/25">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Pedido confirmado</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Seu pedido foi enviado para a API com sucesso.
        </p>
        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/25 px-4 py-3 text-sm">
          ID do pedido: <span className="font-semibold text-primary">{successId}</span>
        </div>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/products")}
          >
            Continuar comprando
          </Button>
          <Button variant="secondary" className="h-11 rounded-2xl" onClick={() => navigate("/")}
          >
            Voltar para Home
          </Button>
        </div>
      </Card>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Dados do cliente (apenas frontend) + envio via <code className="rounded bg-muted/40 px-1">POST /api/orders</code>.
        </p>

        <Separator className="my-6 bg-border/60" />

        <form
          className="grid gap-4"
          onSubmit={handleSubmit(() => mutation.mutate())}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("name")}
              />
              {errors.name ? (
                <div className="text-xs text-destructive">{errors.name.message}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("email")}
              />
              {errors.email ? (
                <div className="text-xs text-destructive">{errors.email.message}</div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("phone")}
              />
              {errors.phone ? (
                <div className="text-xs text-destructive">{errors.phone.message}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("zip")}
              />
              {errors.zip ? (
                <div className="text-xs text-destructive">{errors.zip.message}</div>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
              placeholder="Rua, número, complemento…"
              {...register("line1")}
            />
            {errors.line1 ? (
              <div className="text-xs text-destructive">{errors.line1.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Complemento (opcional)</Label>
            <Input
              className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
              {...register("line2")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label>Cidade</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("city")}
              />
              {errors.city ? (
                <div className="text-xs text-destructive">{errors.city.message}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("state")}
              />
              {errors.state ? (
                <div className="text-xs text-destructive">{errors.state.message}</div>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="mt-2 h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Confirmar e enviar pedido
              </>
            )}
          </Button>
        </form>
      </Card>

      <Card className="h-fit rounded-3xl border-border/60 bg-card/60 p-6">
        <div className="text-sm font-semibold tracking-wide">Resumo do pedido</div>
        <Separator className="my-4 bg-border/60" />

        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-2xl border border-border/60">
                <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{i.name}</div>
                <div className="text-xs text-foreground/60">
                  {i.quantity}× {formatBRL(i.price)}
                </div>
              </div>
              <div className="text-sm font-semibold">{formatBRL(i.price * i.quantity)}</div>
            </div>
          ))}
        </div>

        <Separator className="my-4 bg-border/60" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">Subtotal</span>
          <span className="font-semibold">{formatBRL(subtotal)}</span>
        </div>

        <div className="mt-2 text-xs text-foreground/55">
          O backend deve calcular frete/total e retornar status do pedido.
        </div>
      </Card>
    </div>
  );
}
