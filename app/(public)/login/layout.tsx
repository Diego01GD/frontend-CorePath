import type { Metadata } from "next";

// La página es de cliente y no puede exportar metadata: el título va en este layout
export const metadata: Metadata = {
  title: { default: "Iniciar sesión", template: "%s · CorePath" },
  description:
    "Entra a CorePath con tu cuenta institucional del TecNM campus Mérida.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
