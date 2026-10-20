import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontTitulos = Fraunces({
  variable: "--font-titulos", 
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const fontTextos = Plus_Jakarta_Sans({
  variable: "--font-textos",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CorePath",
  description: "Asistente Virtual Vocacional para el Instituto Tecnologico de Mérida",
  icons: {
    icon: '/images/favicon.ico'
  }
};

const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light";document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fontTitulos.variable} ${fontTextos.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Aplica el tema antes del primer pintado para evitar el parpadeo claro; misma lógica que ThemeControl */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-textos">{children}</body>
    </html>
  );
}
