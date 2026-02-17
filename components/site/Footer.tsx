import { Heart, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl ring-1 ring-border/60">
                <img src="/seoul-beat-logo.jpeg" alt="Seoul Beat" className="h-full w-full object-cover" />
              </span>
              <div>
                <div className="text-sm font-semibold tracking-wide">Seoul Beat</div>
                <div className="text-xs text-foreground/60">Produtos oficiais importados da Coreia do Sul</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/70">
              Uma curadoria cuidadosa de álbuns, lightsticks e colecionáveis da cena K-pop global.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-foreground/70">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              COMPRA COM CONFIANÇA
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <Link href="/policies">Políticas da loja</Link>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <Link href="/policies/shipping">Tipos de envio</Link>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <Link href="/contact">Fale conosco</Link>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <Link href="/policies/privacy">Política de privacidade</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-muted/25 p-6">
            <p className="text-sm text-foreground/70">
              Conectando o Brasil à cultura K-pop com curadoria, transparência e paixão genuína.
            </p>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="text-xs text-foreground/55">
          <span>© {new Date().getFullYear()} Seoul Beat.</span>
        </div>
      </div>
    </footer>
  );
}
