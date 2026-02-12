import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

import {
  createKtown4uOrder,
  createMercadoPagoPreference,
  processMercadoPagoPayment,
} from "@/lib/api";
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
  document: z.string().min(11, "CPF inválido"),
  street: z.string().min(3, "Rua inválida"),
  number: z.string().min(1, "Número inválido"),
  complement: z.string().optional(),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().min(2, "Estado inválido"),
  zip: z.string().min(5, "CEP inválido"),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY as string | undefined;

  useEffect(() => {
    if (!mpPublicKey) return;
    initMercadoPago(mpPublicKey, { locale: "pt-BR" });
  }, [mpPublicKey]);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });
  const [noNumber, setNoNumber] = useState(false);

  function formatCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (rest.length <= 4) return `(${ddd}) ${rest}`;
    if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  }

  function formatCpf(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  function getCpfDigits(value: string) {
    return value.replace(/\D/g, "");
  }

  function extractPreferenceIdFromUrl(url?: string) {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get("pref_id") ?? parsed.searchParams.get("preference_id");
    } catch {
      return null;
    }
  }

  async function handleCepLookup(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8) return;
    try {
      setIsCepLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data?.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Confira o CEP informado.",
          variant: "destructive",
        });
        return;
      }
      if (data.logradouro) form.setValue("street", data.logradouro);
      if (data.localidade) form.setValue("city", data.localidade);
      if (data.uf) form.setValue("state", data.uf);
    } catch {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsCepLoading(false);
    }
  }

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const v = form.getValues();
      return createKtown4uOrder({
        items: items.map((i) => ({
          goodsNo: String(i.productId),
          variationId: i.variationId,
          quantity: i.quantity,
        })),
        customerName: v.name,
        customerEmail: v.email,
        customerPhone: v.phone,
        customerDocument: v.document,
        shippingAddress: `${v.street}, ${v.number}${v.complement ? ` ${v.complement}` : ""}`,
        shippingCity: v.city,
        shippingState: v.state,
        shippingZipCode: v.zip,
      });
    },
    onSuccess: async (res) => {
      setOrderId(res.orderId);
      try {
        const pref = await createMercadoPagoPreference(res.orderId);
        const resolvedPreferenceId =
          pref.preferenceId ??
          extractPreferenceIdFromUrl(pref.initPoint) ??
          extractPreferenceIdFromUrl(pref.sandboxInitPoint);
        setPreferenceId(resolvedPreferenceId ?? null);
        if (!resolvedPreferenceId) {
          toast({
            title: "Preferência Mercado Pago não encontrada",
            description:
              "Carteira Mercado Pago e Linha de Crédito podem não aparecer sem preferenceId.",
            variant: "destructive",
          });
        }
      } catch (e) {
        setPreferenceId(null);
        toast({
          title: "Não foi possível preparar a preferência Mercado Pago",
          description: e instanceof Error ? e.message : "Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsCreatingOrder(false);
      }
      toast({
        title: "Pedido criado!",
        description: `ID: ${res.orderId}`,
      });
    },
    onError: (e) => {
      setIsCreatingOrder(false);
      toast({
        title: "Não foi possível criar o pedido",
        description: e instanceof Error ? e.message : "Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const watchedName = useWatch({ control, name: "name" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedDocument = useWatch({ control, name: "document" });
  const watchedZip = useWatch({ control, name: "zip" });

  const payer = useMemo(() => {
    const name = (watchedName ?? "").trim();
    const parts = name ? name.split(/\s+/) : [];
    const firstName = parts[0] ?? "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    const cpf = getCpfDigits(watchedDocument ?? "");
    return {
      firstName,
      lastName,
      email: watchedEmail ?? "",
      identification: cpf ? { type: "CPF", number: cpf } : undefined,
      address: watchedZip ? { zip_code: watchedZip } : undefined,
    };
  }, [watchedName, watchedEmail, watchedDocument, watchedZip]);

  if (!items.length) {
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

  if (isRedirecting) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/15 ring-1 ring-primary/25">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Redirecionando…</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Estamos abrindo o Mercado Pago para finalizar o pagamento.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Informe seus dados para confirmar a compra.
        </p>

        <Separator className="my-6 bg-border/60" />

        <form
          className="grid gap-4"
          onSubmit={handleSubmit(() => {
            setIsCreatingOrder(true);
            setPreferenceId(null);
            createOrderMutation.mutate();
          })}
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
                {...register("phone", {
                  onChange: (e) => {
                    form.setValue("phone", formatPhone(e.target.value), {
                      shouldDirty: true,
                    });
                  },
                })}
              />
              {errors.phone ? (
                <div className="text-xs text-destructive">{errors.phone.message}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>CPF</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("document", {
                  onChange: (e) => {
                    form.setValue("document", formatCpf(e.target.value), {
                      shouldDirty: true,
                    });
                  },
                })}
              />
              {errors.document ? (
                <div className="text-xs text-destructive">{errors.document.message}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>CEP</Label>
              <div className="relative">
                <Input
                  className="h-11 rounded-2xl border-border/60 bg-muted/25 pr-10 focus-visible:ring-primary"
                  {...register("zip", {
                    onChange: (e) => {
                      form.setValue("zip", formatCep(e.target.value), {
                        shouldDirty: true,
                      });
                    },
                    onBlur: (e) => {
                      void handleCepLookup(e.target.value);
                    },
                  })}
                />
                {isCepLoading ? (
                  <div className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-foreground/60">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground/70" />
                  </div>
                ) : null}
              </div>
              {errors.zip ? (
                <div className="text-xs text-destructive">{errors.zip.message}</div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label>Rua</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                disabled
                {...register("street")}
              />
              {errors.street ? (
                <div className="text-xs text-destructive">{errors.street.message}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                disabled={noNumber}
                {...register("number", {
                  onChange: (e) => {
                    if (noNumber) return;
                    form.setValue("number", e.target.value, { shouldDirty: true });
                  },
                })}
              />
              {errors.number ? (
                <div className="text-xs text-destructive">{errors.number.message}</div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <input
              id="no-number"
              type="checkbox"
              checked={noNumber}
              onChange={(e) => {
                const checked = e.target.checked;
                setNoNumber(checked);
                form.setValue("number", checked ? "s/n" : "", { shouldDirty: true });
              }}
            />
            <Label htmlFor="no-number">Sem número (s/n)</Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Complemento (opcional)</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                {...register("complement")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label>Cidade</Label>
              <Input
                className="h-11 rounded-2xl border-border/60 bg-muted/25 focus-visible:ring-primary"
                disabled
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
                disabled
                {...register("state")}
              />
              {errors.state ? (
                <div className="text-xs text-destructive">{errors.state.message}</div>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            disabled={createOrderMutation.isPending || isCreatingOrder}
            className="mt-2 h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {createOrderMutation.isPending || isCreatingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando pedido…
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Confirmar compra
              </>
            )}
          </Button>
        </form>

        {mpPublicKey && orderId && !isCreatingOrder ? (
          <div className="mt-6">
            <Payment
              key={`payment-${orderId}-${preferenceId ?? "no-preference"}`}
              initialization={{
                amount: Number(subtotal.toFixed(2)),
                payer,
                ...(preferenceId ? { preferenceId } : {}),
              }}
              customization={{
                visual: {
                  style: {
                    theme: "dark",
                  },
                },
                paymentMethods: {
                  creditCard: "all",
                  debitCard: "all",
                  ticket: "all",
                  bankTransfer: "all",
                  mercadoPago: "all",
                  maxInstallments: 12,
                  types: {
                    included: [
                      "creditCard",
                      "debitCard",
                      "ticket",
                      "bank_transfer",
                      "wallet_purchase",
                      "onboarding_credits",
                    ],
                  },
                },
              }}
              onSubmit={async ({ formData }) => {
                try {
                  setIsRedirecting(true);
                  const result = await processMercadoPagoPayment({
                    ...formData,
                    orderId,
                  });
                  clearCart();
                  if (result?.status === "approved") {
                    navigate("/payment/success");
                  } else if (result?.status === "pending") {
                    navigate("/payment/pending");
                  } else if (result?.status === "rejected" || result?.status === "failure") {
                    navigate("/payment/failure");
                  } else {
                    navigate("/payment/pending");
                  }
                } finally {
                  setIsRedirecting(false);
                }
              }}
              onError={(error) => {
                setIsRedirecting(false);
                toast({
                  title: "Erro no pagamento",
                  description: error?.message ?? "Tente novamente.",
                  variant: "destructive",
                });
              }}
            />
          </div>
        ) : null}
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
          Frete será calculado pelo backend.
        </div>
      </Card>
    </div>
  );
}
