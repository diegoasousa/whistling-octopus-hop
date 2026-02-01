import { Sparkles, Heart, ShieldCheck, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
                <Sparkles className="h-5 w-5 text-primary" />
              </span>
              <div>
                <div className="text-sm font-semibold tracking-wide">Neon Fandom</div>
                <div className="text-xs text-foreground/60">produtos estilo K-pop • sem marcas oficiais</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
              Uma vitrine moderna para colecionáveis e acessórios inspirados na cultura
              fandom.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-foreground/70">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              COMPRA COM CONFIANÇA
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Checkout via API REST (sem chaves no frontend)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Estrutura pronta para integrar com backend real</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span>Experiência mobile-first e dark mode</span>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-muted/25 p-6">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              NOTAS
            </div>
            <p className="mt-3 text-sm text-foreground/70">
              Este projeto contém mock de API apenas para desenvolvimento local.
              Em produção, basta apontar os mesmos endpoints para seu backend.
            </p>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col gap-2 text-xs text-foreground/55 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Neon Fandom. Frontend demo.</span>
          <span>Sem nomes de grupos, idols ou marcas oficiais.</span>
        </div>
      </div>
    </footer>
  );
}
