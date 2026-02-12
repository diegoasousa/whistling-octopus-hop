import { Link } from "react-router-dom";
import { ChevronLeft, Mail, MessageCircle } from "lucide-react";

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
        <Link to="/">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <Card className="rounded-3xl border-border/60 bg-card/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Fale conosco</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Precisa de ajuda com seu pedido, rastreio ou dúvidas? Fale com a nossa equipe.
        </p>

        <Separator className="my-6 bg-border/60" />

        <div className="space-y-4 text-sm text-foreground/70">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest text-foreground/60">WHATSAPP</div>
              <div>Atendimento em horário comercial. Respostas em até 24h úteis.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest text-foreground/60">EMAIL</div>
              <div>Envie sua mensagem com número do pedido para agilizar o suporte.</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
