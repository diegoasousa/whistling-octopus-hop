'use client'

import Link from "next/link";
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
        <Link href="/">
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
            Aqui cada pedido é conferido com carinho antes de ser enviado! 
            🩷 Após a confirmação, seu item passa pelo nosso processo de importação e controle de qualidade, sendo despachado em até 15 a 30 dias úteis.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              TROCAS, DEVOLUÇÕES E CANCELAMENTO
            </div>
            <div>
              Cancelamentos só são possíveis antes do pedido estar "Embalado" e sem trânsito
              iniciado. Para trocas e devoluções, o produto precisa estar sem uso e lacrado, seguindo
              o prazo legal de arrependimento.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              RASTREIO
            </div>
            <div>
              Após o despacho do seu pedido, você receberá o código de rastreio nacional diretamente por e-mail ou WhatsApp. 
              Acompanhe a entrega pelo site dos Correios ou pelo app Melhor Rastreio. 📦
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
