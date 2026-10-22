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

const DESCRIPCION =
  "Descubre qué especialidad de Ingeniería en Sistemas Computacionales va contigo con un test RIASEC y A.N.A, la orientadora virtual del TecNM campus Mérida.";

// La imagen para compartir sale de app/opengraph-image.png (Next la agrega sola a og:image y twitter:image)
export const metadata: Metadata = {
  metadataBase: new URL("https://www.corepath.com.mx"),
  title: { default: "CorePath · Asistente vocacional", template: "%s · CorePath" },
  description: DESCRIPCION,
  applicationName: "CorePath",
  icons: { icon: "/images/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "CorePath",
    title: "CorePath · Tu futuro no debe ser al azar",
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: "CorePath · Tu futuro no debe ser al azar",
    description: DESCRIPCION,
  },
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
