'use client'

import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">Fale conosco</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Ficou com dúvida? Quer saber sobre o seu pedido? Tá com saudade de um produto esgotado?
          A gente está aqui. Fala com a Seoul Pulse — respondemos com carinho e o mais rápido possível.
          Porque fã entende fã.
        </p>

        <Separator className="my-6 bg-border/60" />

        <div className="space-y-4 text-sm text-foreground/70">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest text-foreground/60">EMAIL</div>
              <a
                href="mailto:contato@seoulpulse.com.br"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                contato@seoulpulse.com.br
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-border/60" />

        <div className="rounded-2xl border border-border/60 bg-muted/25 p-5 space-y-3">
          <div className="text-xs font-semibold tracking-widest text-foreground/60">DADOS DA EMPRESA</div>
          <div className="space-y-2 text-sm text-foreground/70">
            <div className="flex justify-between gap-4">
              <span className="text-foreground/50">Razão Social</span>
              <span className="text-right">Seoul Pulse (MEI)</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-foreground/50">CNPJ</span>
              <span className="text-right">65.292.275/0001-91</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-foreground/50">E-mail</span>
              <a
                href="mailto:contato@seoulpulse.com.br"
                className="text-primary hover:text-primary/80 transition-colors text-right"
              >
                contato@seoulpulse.com.br
              </a>
            </div>
          </div>
          <p className="text-xs text-foreground/50 pt-1">Respondemos em até 48 horas úteis.</p>
        </div>
      </Card>
    </div>
  );
}
