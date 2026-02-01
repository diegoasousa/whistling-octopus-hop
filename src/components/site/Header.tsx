import { NavLink, useNavigate } from "react-router-dom";
import { Sparkles, ShoppingBag, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-full px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:text-foreground",
          isActive && "bg-muted text-foreground",
        )
      }
    >
      {children}
    </NavLink>
  );
}

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const cartBadge = useMemo(() => {
    if (!count) return null;
    return (
      <Badge className="pointer-events-none absolute -right-2 -top-2 rounded-full bg-primary text-primary-foreground">
        {count}
      </Badge>
    );
  }, [count]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/55">
      <div className="container flex h-16 items-center gap-3">
        <NavLink to="/" className="group flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25 transition group-hover:bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Neon Fandom</div>
            <div className="text-xs text-foreground/60">storefront K-pop vibe</div>
          </div>
        </NavLink>

        <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
          <div className="relative w-full max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar lightsticks, cards, bottons…"
              className="h-10 rounded-full border-border/60 bg-muted/40 pl-9 focus-visible:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/products?q=${encodeURIComponent(q.trim())}`);
                }
              }}
            />
          </div>
          <nav className="flex items-center gap-1">
            <NavItem to="/products">Produtos</NavItem>
            <NavItem to="/cart">Carrinho</NavItem>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            className="relative hidden rounded-full md:inline-flex"
            onClick={() => navigate("/cart")}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartBadge}
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-background">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/25">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </span>
                  Neon Fandom
                </SheetTitle>
              </SheetHeader>

              <div className="mt-5 space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar produtos…"
                    className="h-10 rounded-full border-border/60 bg-muted/40 pl-9 focus-visible:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(`/products?q=${encodeURIComponent(q.trim())}`);
                      }
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-between rounded-2xl"
                    onClick={() => navigate("/products")}
                  >
                    Produtos
                    <span className="text-xs text-foreground/60">/products</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-between rounded-2xl"
                    onClick={() => navigate("/cart")}
                  >
                    Carrinho
                    <span className="text-xs text-foreground/60">
                      {count ? `${count} item(s)` : "vazio"}
                    </span>
                  </Button>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <div className="text-sm font-medium">Dark mode (padrão)</div>
                  <div className="mt-1 text-xs text-foreground/60">
                    Paleta inspirada em roxo + rosa neon.
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
