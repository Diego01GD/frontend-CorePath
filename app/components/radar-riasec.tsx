"use client";

import { useEffect, useRef } from "react";
import { Chart, Filler, LineElement, PointElement, RadarController, RadialLinearScale, Tooltip } from "chart.js";
import { COLOR_DIMENSION, DIMENSIONES } from "@/lib/resultados";

// Solo las piezas del radar: mantiene el paquete pequeño
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const ORDEN = ["R", "I", "A", "S", "E", "C"]; // orden del hexágono de Holland

const tokens = () => {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string) => css.getPropertyValue(n).trim();
  return {
    dims: ORDEN.map((d) => v(COLOR_DIMENSION[d])),
    relleno: conAlfa(v("--ctext"), 0.07), // neutro: los colores van en puntos, tramos y etiquetas
    texto2: v("--ctext-2"),
    rejilla: v("--pista"),
    panel: v("--cards"),
    fuente: v("--font-textos") || "sans-serif",
  };
};

// El lienzo no interpreta var() ni color-mix(): se convierte el hex del token a rgba
function conAlfa(hex: string, alfa: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return Number.isNaN(n) ? hex : `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
}

type Tokens = ReturnType<typeof tokens>;

export default function RadarRiasec({ dimensiones }: { dimensiones: Record<string, number> }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!lienzo.current) return;
    let t: Tokens = tokens();
    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grafica = new Chart(lienzo.current, {
      type: "radar",
      data: {
        labels: ORDEN.map((d) => `${DIMENSIONES[d]} (${d})`),
        datasets: [
          {
            data: ORDEN.map((d) => dimensiones[d] ?? 0),
            // Funciones: leen `t`, así basta con reasignarlo y actualizar al cambiar el tema
            backgroundColor: () => t.relleno,
            pointBackgroundColor: (c) => t.dims[c.dataIndex],
            pointBorderColor: () => t.panel,
            pointHoverBackgroundColor: (c) => t.dims[c.dataIndex],
            // El radar no admite color por tramo: un degradado cónico desde el centro pasa por el color de cada dimensión
            borderColor: (c) => {
              const r = c.chart.scales.r as RadialLinearScale | undefined;
              if (!r) return t.dims[0];
              const g = c.chart.ctx.createConicGradient(-Math.PI / 2, r.xCenter, r.yCenter); // 0 = arriba (R)
              t.dims.forEach((color, i) => g.addColorStop(i / t.dims.length, color));
              g.addColorStop(1, t.dims[0]);
              return g;
            },
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderWidth: 2,
            borderWidth: 2.5,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: reducir ? false : { duration: 700 },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${Number(c.raw).toFixed(2)} de 5` } },
        },
        scales: {
          r: {
            min: 1,
            max: 5,
            ticks: { stepSize: 1, color: () => t.texto2, backdropColor: "transparent", font: { size: 11 } },
            grid: { color: () => t.rejilla },
            angleLines: { color: () => t.rejilla },
            pointLabels: { color: (c) => t.dims[c.index], font: { size: 13, weight: 700, family: t.fuente } },
          },
        },
      },
    });

    const observador = new MutationObserver(() => {
      t = tokens();
      grafica.update("none");
    });
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observador.disconnect();
      grafica.destroy();
    };
  }, [dimensiones]);

  return (
    <figure className="w-full">
      <canvas ref={lienzo} role="img" aria-label="Hexágono RIASEC con tus puntajes por dimensión; el detalle está en la tabla siguiente." />
      <table className="sr-only">
        <caption>Puntaje por dimensión RIASEC (de 1 a 5)</caption>
        <tbody>
          {ORDEN.map((d) => (
            <tr key={d}>
              <th scope="row">{DIMENSIONES[d]}</th>
              <td>{(dimensiones[d] ?? 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
