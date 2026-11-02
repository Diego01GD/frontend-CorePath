import type { MetadataRoute } from "next";

const SITIO = "https://www.corepath.com.mx";

// Solo páginas públicas; las protegidas están bloqueadas en robots.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITIO, changeFrequency: "monthly", priority: 1 },
    { url: `${SITIO}/nosotros`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITIO}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITIO}/login`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITIO}/politica-privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITIO}/politica-uso`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
