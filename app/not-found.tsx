'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Ghost } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname]);

  return (
    <Card className="mx-auto max-w-xl rounded-3xl border-border/60 bg-card/60 p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/15 ring-1 ring-primary/25">
        <Ghost className="h-7 w-7 text-primary" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">404</h1>
      <p className="mt-2 text-sm text-foreground/70">
        Não encontramos esta página: <span className="font-medium">{pathname}</span>
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild className="h-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/">Voltar para Home</Link>
        </Button>
        <Button asChild variant="secondary" className="h-11 rounded-2xl">
          <Link href="/products">Ver produtos</Link>
        </Button>
      </div>
    </Card>
  );
}
