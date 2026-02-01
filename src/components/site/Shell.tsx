import { Outlet } from "react-router-dom";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function Shell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
