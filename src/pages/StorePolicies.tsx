import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function StorePoliciesPage() {
  return (
    <div className="space-y-6">
      <Button
        asChild
        variant="ghost"
        className="-ml-2 rounded-full text-foreground/70 hover:text-foreground"
      >
        <Link to="/">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Políticas da loja</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Aqui você encontra as regras principais sobre cadastro, envio, prazos e pós-compra.
        </p>

        <Separator className="my-6 bg-border/60" />

        <div className="space-y-6 text-sm text-foreground/70">
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              CADASTRO E DADOS
            </div>
            <div>
              Os dados de entrega precisam bater com o CPF informado na compra. Divergências podem
              gerar atrasos, devoluções e cobranças adicionais.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              PRAZOS E ENVIO
            </div>
            <div>
              Após a compra, o pedido pode ser marcado como “Embalado” em até 7 dias corridos.
              Para importados, o rastreio costuma ser enviado de 7 a 15 dias úteis após esse status.
              Em pronta-entrega, o despacho acontece em até 7 dias úteis.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              TAXAS E IMPORTAÇÃO
            </div>
            <div>
              Importados podem sofrer taxas aduaneiras. O pagamento é obrigatório e normalmente
              informado no rastreio, com prazo limitado para quitação. A não quitação pode gerar
              devolução e custos extras.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              TROCAS, DEVOLUÇÕES E CANCELAMENTO
            </div>
            <div>
              Cancelamentos só são possíveis antes do pedido estar “Embalado” e sem trânsito
              iniciado. Para trocas e devoluções, o produto precisa estar sem uso e lacrado, seguindo
              o prazo legal de arrependimento.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              RASTREIO
            </div>
            <div>
              Acompanhe o código com frequência e vincule o CPF no ambiente “Minhas importações”
              dos Correios quando solicitado. Avisos de taxas e pendências são enviados por lá.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
