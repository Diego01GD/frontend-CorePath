"use client";

import { useReportWebVitals } from "next/web-vitals";
import { medir } from "@/lib/metricas";

// Fuera del componente: si la función cambia entre renders, Next reporta la métrica repetida
const reportar: Parameters<typeof useReportWebVitals>[0] = (m) => {
  if (!["LCP", "INP", "CLS", "FCP", "TTFB"].includes(m.name)) return;
  medir("web_vital", { nombre: m.name, valor: Math.round(m.value * 10000) / 10000, vista: location.pathname.replace(/\/resultados\/[^/]+/, "/resultados/{id}") });
};

export default function WebVitals() {
  useReportWebVitals(reportar);
  return null;
}
