import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentFailurePage() {
  const [sp] = useSearchParams();
  const orderId = sp.get("external_reference") ?? sp.get("merchant_order_id") ?? "";

  return (
    <Card className="rounded-3xl border-border/60 bg-card/60 p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-destructive/15 ring-1 ring-destructive/25">
        <XCircle className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Pagamento não aprovado</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Não foi possível concluir o pagamento. Você pode tentar novamente.
      </p>
      {orderId ? (
        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/25 px-4 py-3 text-sm">
          <div>
            Referência: <span className="font-semibold text-primary">{orderId}</span>
          </div>
        </div>
      ) : null}
      <div className="mt-7 flex flex-col gap-2">
        <Button asChild className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/products">Voltar para produtos</Link>
        </Button>
        <Button asChild variant="secondary" className="h-11 rounded-2xl">
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    </Card>
  );
}
