'use client'

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ShippingInfoPage() {
  return (
    <div className="space-y-6">
      <Button
        asChild
        variant="ghost"
        className="-ml-2 rounded-full text-foreground/70 hover:text-foreground"
      >
        <Link href="/">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tipos de envio</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Na Seoul Pulse, todos os envios são internacionais e seguem as regras de importação.
        </p>

        <Separator className="my-6 bg-border/60" />

        <div className="space-y-6 text-sm text-foreground/70">
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              ENVIO INTERNACIONAL
            </div>
            <div>
              Os pedidos são enviados diretamente de distribuidores oficiais. O prazo varia
              conforme o item, a janela de lançamento e o lote disponível.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              PRAZOS
            </div>
            <div>
              Em média, o rastreio é liberado alguns dias após a confirmação do pedido. Itens
              em pré-venda seguem o prazo anunciado na página do produto.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              TAXAS INCLUSAS
            </div>
            <div>
              As taxas aduaneiras já estão inclusas no valor pago na Seoul Pulse. Não há cobranças
              adicionais após a compra.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              RASTREIO
            </div>
            <div>
              Assim que o rastreio estiver disponível, você receberá por email. Recomendamos
              acompanhar o status regularmente para atualizações de entrega.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
