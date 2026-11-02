import type { MetadataRoute } from "next";
import { RUTAS_PROTEGIDAS } from "@/lib/auth";

const SITIO = "https://www.corepath.com.mx";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Vistas con sesión y pasos del login: no aportan a buscadores y algunas tienen datos personales
      disallow: [...RUTAS_PROTEGIDAS, "/auth/", "/login/"], // cada regla bloquea la ruta y todo lo que cuelga de ella
    },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
