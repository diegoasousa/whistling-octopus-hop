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
                <img src="/seoul-pulse-logo.png" alt="Seoul Pulse" className="h-full w-full object-cover" />
              </span>
              <div>
                <div className="text-sm font-semibold tracking-wide">Seoul Pulse</div>
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

          <div className="rounded-3xl border border-border/60 bg-muted/25 p-6 space-y-4">
            <div className="text-xs font-semibold tracking-widest text-foreground/60">
              NOS SIGA
            </div>
            <div className="space-y-3 text-sm text-foreground/70">
              <a
                href="https://instagram.com/seoulpulse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                @seoulpulse no Instagram
              </a>
              <a
                href="https://tiktok.com/@seoulpulse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
                @seoulpulse no TikTok
              </a>
            </div>
            <p className="text-xs text-foreground/50">
              Novidades, restocks e muito K-pop por lá.
            </p>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="text-xs text-foreground/55">
          <span>© {new Date().getFullYear()} Seoul Pulse.</span>
        </div>
      </div>
    </footer>
  );
}
