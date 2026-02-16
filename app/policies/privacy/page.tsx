'use client'

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Política de privacidade</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Esta política explica como a Seoul Beat coleta, usa e protege seus dados.
        </p>

        <Separator className="my-6 bg-border/60" />

        <div className="space-y-6 text-sm text-foreground/70">
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              IDENTIFICAÇÃO
            </div>
            <div>
              Seoul Beat — CNPJ 00.000.000/0000-00. Endereço: Rua Exemplo, 123, São Paulo/SP.
              Telefone: (11) 99999-9999. Email: contato@seoulbeat.com.br.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              DADOS COLETADOS
            </div>
            <div>
              Coletamos informações necessárias para processar pedidos, como nome completo,
              CPF, email, telefone e endereço de entrega.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              USO DAS INFORMAÇÕES
            </div>
            <div>
              Os dados são usados para comunicação, processamento de pedidos, emissão de notas
              fiscais quando aplicável e suporte ao cliente.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              COMPARTILHAMENTO
            </div>
            <div>
              Compartilhamos dados apenas com parceiros logísticos e de pagamento, quando
              necessário para a entrega e confirmação da compra.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              SEGURANÇA
            </div>
            <div>
              Adotamos medidas técnicas e administrativas para proteger seus dados contra acesso
              não autorizado, perda ou uso indevido.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              CONTATO
            </div>
            <div>
              Para dúvidas sobre privacidade, utilize o canal "Fale conosco" disponível no site.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
