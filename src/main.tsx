import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// PWA: asegurar que la PWA instalada en iPhone/desktop reciba los updates
import { registerSW } from "virtual:pwa-register";
import { toast } from "@/components/ui/sonner";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    toast("Actualización disponible", {
      description: "Toca 'Actualizar' para cargar la última versión.",
      action: {
        label: "Actualizar",
        onClick: () => updateSW(true),
      },
      duration: 60_000,
    });
  },
  onOfflineReady() {
    // opcional: avisar que ya funciona offline
  },
});

createRoot(document.getElementById("root")!).render(<App />);
