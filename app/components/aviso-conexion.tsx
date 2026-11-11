"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

const suscribir = (avisar: () => void) => {
  addEventListener("online", avisar);
  addEventListener("offline", avisar);
  return () => {
    removeEventListener("online", avisar);
    removeEventListener("offline", avisar);
  };
};

// Aviso de "sin conexión" (eventos online/offline). La región role=status existe siempre para que el lector
// de pantalla anuncie el cambio. En el servidor se asume conexión.
export default function AvisoConexion() {
  const enLinea = useSyncExternalStore(suscribir, () => navigator.onLine, () => true);
  return (
    <div role="status" className="print:hidden">
      {!enLinea && (
        <p className="flex items-center justify-center gap-2 border-b border-error/30 bg-error/10 px-4 py-2 text-center text-sm motion-safe:animate-aparecer">
          <WifiOff size={16} className="shrink-0 text-error" aria-hidden="true" />
          Sin conexión a internet. Lo que llevas no se pierde: podrás continuar al reconectarte.
        </p>
      )}
    </div>
  );
}
