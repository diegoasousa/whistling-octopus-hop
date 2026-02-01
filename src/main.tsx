import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { enableMockApi } from "@/mocks/enableMockApi";

// Dark mode como padrão
document.documentElement.classList.add("dark");
(document.documentElement as HTMLElement).style.colorScheme = "dark";

// Mock de API para desenvolvimento local
if (import.meta.env.MODE === "development") {
  enableMockApi();
}

createRoot(document.getElementById("root")!).render(<App />);