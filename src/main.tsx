import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { enableMockApi } from "@/mocks/enableMockApi";

// Dark mode como padrão
document.documentElement.classList.add("dark");
(document.documentElement as HTMLElement).style.colorScheme = "dark";

// Mock de API controlado por flag explícita
if (import.meta.env.VITE_USE_MOCKS === "true") {
  enableMockApi();
}

createRoot(document.getElementById("root")!).render(<App />);
