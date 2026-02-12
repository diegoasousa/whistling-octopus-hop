import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Clock, XCircle, Truck } from "lucide-react";

import { getOrderById, getPaymentStatus } from "@/lib/api";
import { formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const STATUS_LABELS = {
  PENDING: "Aguardando pagamento",
  PAID: "Pago",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const STATUS_ICONS = {
  PENDING: <Clock className="h-6 w-6 text-yellow-500" />,
  PAID: <CheckCircle2 className="h-6 w-6 text-green-500" />,
  PROCESSING: <Clock className="h-6 w-6 text-blue-500" />,
  SHIPPED: <Truck className="h-6 w-6 text-blue-500" />,
  DELIVERED: <CheckCircle2 className="h-6 w-6 text-green-500" />,
  CANCELLED: <XCircle className="h-6 w-6 text-red-500" />,
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const orderIdSafe = orderId ?? "";

  const {
    data: order,
    isLoading: orderLoading,
    isError: orderError,
    error: orderErrorMsg,
  } = useQuery({
    queryKey: ["orders", orderIdSafe],
    queryFn: () => getOrderById(orderIdSafe),
    enabled: Boolean(orderId),
    retry: 1,
  });

  const {
    data: payment,
    isLoading: paymentLoading,
  } = useQuery({
    queryKey: ["payment", orderIdSafe],
    queryFn: () => getPaymentStatus(orderIdSafe),
    enabled: Boolean(orderId),
    retry: 1,
  });

  if (!orderId) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-8 text-center">
        <div className="text-sm font-medium text-destructive">ID de pedido inválido</div>
        <Button asChild className="mt-6 h-11 rounded-2xl bg-primary">
          <Link to="/">Voltar para Home</Link>
        </Button>
      </Card>
    );
  }

  if (orderLoading) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-8 text-center">
        <div className="text-sm font-medium">Carregando informações do pedido...</div>
      </Card>
    );
  }

  if (orderError) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-8 text-center">
        <div className="text-sm font-medium text-destructive">
          Erro ao carregar pedido: {orderErrorMsg instanceof Error ? orderErrorMsg.message : "Tente novamente"}
        </div>
        <Button asChild className="mt-6 h-11 rounded-2xl bg-primary">
          <Link to="/">Voltar para Home</Link>
        </Button>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card/60 p-8 text-center">
        <div className="text-sm font-medium">Pedido não encontrado</div>
        <Button asChild className="mt-6 h-11 rounded-2xl bg-primary">
          <Link to="/">Voltar para Home</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Detalhes do Pedido</h1>
            <p className="mt-1 text-sm text-foreground/70">
              Número: <span className="font-semibold text-primary">{order.orderNumber}</span>
            </p>
            <p className="text-xs text-foreground/55 mt-1">
              ID: {order.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {STATUS_ICONS[order.status as keyof typeof STATUS_ICONS]}
            <div className="text-right">
              <div className="text-sm font-semibold">
                {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]}
              </div>
              <div className="text-xs text-foreground/60">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : 'Data indisponível'}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-border/60" />

        {/* Status de Pagamento */}
        {payment && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3">Status de Pagamento</h2>
            <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium capitalize">
                    {payment.status === 'approved' && '✅ Pagamento confirmado'}
                    {payment.status === 'pending' && '⏳ Aguardando confirmação'}
                    {payment.status === 'rejected' && '❌ Pagamento rejeitado'}
                    {payment.status === 'cancelled' && '⊘ Pagamento cancelado'}
                  </div>
                  {payment.paymentId && (
                    <div className="text-xs text-foreground/60 mt-1">
                      ID do pagamento: {payment.paymentId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Itens do Pedido */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Itens</h2>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/25 p-3">
                  <div>
                    <div className="text-sm font-medium">Produto ID: {item.productId}</div>
                    {item.variationId && (
                      <div className="text-xs text-foreground/60">Variação: {item.variationId}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      Quantidade: {item.quantity}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-foreground/60">Nenhum item no pedido</div>
            )}
          </div>
        </div>

        <Separator className="my-6 bg-border/60" />

        {/* Informações do Cliente */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Informações do Cliente</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-foreground/60">Nome:</span>
              <span className="ml-2 font-medium">{order.customerName}</span>
            </div>
            <div>
              <span className="text-foreground/60">Email:</span>
              <span className="ml-2 font-medium">{order.customerEmail}</span>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-border/60" />

        {/* Resumo Financeiro */}
        <div className="bg-muted/25 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/70">Total</span>
            <span className="text-lg font-semibold">
              {formatBRL(order.totalCents / 100)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
