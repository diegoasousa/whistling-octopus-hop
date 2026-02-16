'use client';

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Menu, Search, LogOut, LogIn } from "lucide-react";

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
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:text-foreground",
        isActive && "bg-muted text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const { totalItems } = useCart();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [q, setQ] = useState("");

  const cartBadge = useMemo(() => {
    if (!totalItems) return null;
    return (
      <Badge className="pointer-events-none absolute -right-2 -top-2 rounded-full bg-primary text-primary-foreground">
        {totalItems}
      </Badge>
    );
  }, [totalItems]);

  const userInitials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/55">
      <div className="container flex h-16 items-center gap-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl ring-1 ring-border/60 transition group-hover:ring-primary/40">
            <img src="/seoul-beat-logo.jpeg" alt="Seoul Beat" className="h-full w-full object-cover" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Seoul Beat</div>
            <div className="text-xs text-foreground/60">K-pop storefront</div>
          </div>
        </Link>

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
                  router.push(`/products?q=${encodeURIComponent(q.trim())}`);
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
            onClick={() => router.push("/cart")}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartBadge}
          </Button>

          {/* Auth Button */}
          {isLoading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    {user.picture && <AvatarImage src={user.picture} alt={user.name} />}
                    <AvatarFallback className="bg-primary/15 text-primary">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-foreground/60">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/orders/my-orders")}>
                  Meus Pedidos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={login}
              className="hidden rounded-full md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login Google
            </Button>
          )}

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
                  <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-2xl ring-1 ring-border/60">
                    <img
                      src="/seoul-beat-logo.jpeg"
                      alt="Seoul Beat"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  Seoul Beat
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
                        router.push(`/products?q=${encodeURIComponent(q.trim())}`);
                      }
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-between rounded-2xl"
                    onClick={() => router.push("/products")}
                  >
                    Produtos
                    <span className="text-xs text-foreground/60">/products</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full justify-between rounded-2xl"
                    onClick={() => router.push("/cart")}
                  >
                    Carrinho
                    <span className="text-xs text-foreground/60">
                      {totalItems ? `${totalItems} item(s)` : "vazio"}
                    </span>
                  </Button>
                </div>

                {isAuthenticated && user && (
                  <>
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="mt-1 text-xs text-foreground/60">{user.email}</div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full rounded-2xl"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}

                {!isAuthenticated && (
                  <Button
                    onClick={login}
                    className="w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login Google
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
