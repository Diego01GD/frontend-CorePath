import type { Metadata } from "next";

// La página es de cliente y no puede exportar metadata: el título va en este layout
export const metadata: Metadata = {
  title: "Chat con A.N.A",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
