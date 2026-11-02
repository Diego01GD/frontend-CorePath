import type { Metadata } from "next";

// La página es de cliente y no puede exportar metadata: el título va en este layout
export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "El equipo de estudiantes de Ingeniería en Sistemas del Tecnológico de Mérida detrás de CorePath y su propuesta.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
