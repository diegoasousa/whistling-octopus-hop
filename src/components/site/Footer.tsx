import { Heart, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl ring-1 ring-border/60">
                <img src="/kvibe-logo.jpeg" alt="K-Vibe" className="h-full w-full object-cover" />
              </span>
              <div>
                <div className="text-sm font-semibold tracking-wide">K-Vibe</div>
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
              <Link to="/policies">Políticas da loja</Link>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <Link to="/shipping">Tipos de envio</Link>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <Link to="/contact">Fale conosco</Link>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <Link to="/privacy">Política de privacidade</Link>
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
          <span>© {new Date().getFullYear()} K-Vibe. Frontend demo.</span>
          <span>Sem nomes de grupos, idols ou marcas oficiais.</span>
        </div>
      </div>
    </footer>
  );
}
