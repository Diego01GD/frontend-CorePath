// "Image" de react-pdf no es <img>: se renombra para que la regla de alt de HTML no la confunda
import { Document, Font, Image as ImagenPdf, Line, Page, Polygon, StyleSheet, Svg, Text, View, pdf } from "@react-pdf/renderer";
import type { InformeIA } from "./api";
import { datosInforme, nivelCongruencia, ORDEN_RIASEC } from "./informe";
import { DESCRIPCION_DIMENSION, DIMENSIONES, EXPLICACION, formatoFecha, nivel, UMBRALES, type Resultado } from "./resultados";
import { fechaBorrado } from "./retencion";

// Plantilla del informe en PDF. Colores fijos del tema claro: el PDF no depende del CSS ni del tema del usuario.
const C = {
  texto: "#2b1e14",
  texto2: "#6b5a4b",
  primary: "#a34e1c",
  accent: "#c2385f",
  borde: "#d9cdbf",
  pista: "#e6ddd3",
  suave: "#f6ece2",
  especialidad: { "var(--cib)": "#7c3aed", "var(--web)": "#b45309", "var(--ia)": "#0e7490" } as Record<string, string>,
  dim: { R: "#059669", I: "#2563eb", A: "#8b5cf6", S: "#f97316", E: "#e11d48", C: "#475569" } as Record<string, string>,
};

Font.register({
  family: "Fraunces",
  fonts: [
    { src: "/fonts/Fraunces-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Fraunces-Bold.ttf", fontWeight: 700 },
  ],
});
Font.register({
  family: "Jakarta",
  fonts: [
    { src: "/fonts/PlusJakartaSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/PlusJakartaSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/PlusJakartaSans-Bold.ttf", fontWeight: 700 },
  ],
});
// Sin guiones automáticos: el silabeo por defecto es para inglés y corta mal palabras en español
Font.registerHyphenationCallback((palabra) => [palabra]);

const s = StyleSheet.create({
  pagina: { paddingTop: 40, paddingBottom: 52, paddingHorizontal: 44, fontFamily: "Jakarta", fontSize: 10, color: C.texto, lineHeight: 1.45 },
  encabezado: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.borde },
  titulo: { fontFamily: "Fraunces", fontWeight: 700, fontSize: 17, lineHeight: 1.3, marginBottom: 2 },
  h2: { fontFamily: "Fraunces", fontWeight: 600, fontSize: 14, lineHeight: 1.3, marginBottom: 6 },
  h3: { fontWeight: 700, fontSize: 10.5, marginBottom: 2 },
  tenue: { color: C.texto2 },
  chico: { fontSize: 8.5, color: C.texto2 },
  seccion: { marginTop: 18 },
  fila: { flexDirection: "row", justifyContent: "space-between" },
  barra: { height: 6, borderRadius: 3, backgroundColor: C.pista, marginTop: 3, position: "relative" },
  recuadro: { marginTop: 12, padding: 10, borderRadius: 6, backgroundColor: C.suave },
  celda: { paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: C.borde },
  pie: { position: "absolute", bottom: 22, fontSize: 7.5, color: C.texto2 },
});

/** Hexágono RIASEC dibujado en vectores (el PDF no puede usar el lienzo de Chart.js). */
function Hexagono({ dimensiones }: { dimensiones: Record<string, number> }) {
  const ancho = 250, alto = 200, cx = ancho / 2, cy = alto / 2, R = 66;
  const punto = (i: number, v: number) => {
    const ang = (-90 + i * 60) * (Math.PI / 180);
    const r = ((v - 1) / 4) * R;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  };
  const poligono = (v: (i: number) => number) => ORDEN_RIASEC.map((_, i) => punto(i, v(i)).join(",")).join(" ");
  return (
    <Svg width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`}>
      {[2, 3, 4, 5].map((n) => (
        <Polygon key={n} points={poligono(() => n)} stroke={C.pista} strokeWidth={0.8} fill="none" />
      ))}
      {ORDEN_RIASEC.map((_, i) => {
        const [x, y] = punto(i, 5);
        return <Line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.pista} strokeWidth={0.8} />;
      })}
      <Polygon points={poligono((i) => dimensiones[ORDEN_RIASEC[i]] ?? 1)} fill={C.primary} fillOpacity={0.12} stroke={C.texto2} strokeWidth={1.2} />
      {ORDEN_RIASEC.map((d, i) => {
        const [x, y] = punto(i, dimensiones[d] ?? 1);
        return <Polygon key={d} points={`${x - 3},${y} ${x},${y - 3} ${x + 3},${y} ${x},${y + 3}`} fill={C.dim[d]} />;
      })}
      {ORDEN_RIASEC.map((d, i) => {
        const [x, y] = punto(i, 6.1);
        return (
          <Text key={`t${d}`} x={x} y={y + 3} textAnchor="middle" style={{ fontFamily: "Jakarta", fontSize: 8, fontWeight: 700, fill: C.dim[d] }}>
            {`${DIMENSIONES[d]} (${d})`}
          </Text>
        );
      })}
    </Svg>
  );
}

function InformeDocumento({ r, ia, correo }: { r: Resultado; ia: InformeIA | null; correo: string }) {
  const d = datosInforme(r);
  const p = r.puntajes;
  const colorEsp = d.esp ? C.especialidad[d.esp.color] : C.texto;
  const listas: [string, string[]][] = ia
    ? [["Tus fortalezas", ia.fortalezas], ["Para explorar", ia.a_explorar], ["Siguientes pasos", ia.siguientes_pasos]]
    : [];

  return (
    <Document title={`Informe del test vocacional, ${formatoFecha(r.creado_en)}`} author="CorePath" subject="Informe del test vocacional RIASEC" language="es-MX">
      <Page size="A4" style={s.pagina}>
        <View style={s.encabezado}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ImagenPdf src="/images/logo-tec.png" style={{ width: 36, height: 39 }} />
            <View>
              <Text style={s.titulo}>Informe del test vocacional</Text>
              <Text style={s.chico}>CorePath, Instituto Tecnológico de Mérida</Text>
            </View>
          </View>
          <View style={{ fontSize: 8.5 }}>
            <Text><Text style={s.tenue}>Estudiante: </Text>{correo}</Text>
            <Text><Text style={s.tenue}>Fecha del test: </Text>{formatoFecha(r.creado_en)}</Text>
            <Text><Text style={s.tenue}>Disponible hasta: </Text>{formatoFecha(fechaBorrado(r.creado_en))}</Text>
          </View>
        </View>

        <View style={s.seccion} wrap={false}>
          <Text style={s.chico}>Tu resultado</Text>
          <Text style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 24, lineHeight: 1.3, marginBottom: 2, color: colorEsp }}>{d.esp?.nombre ?? "Sin afinidad clara"}</Text>
          <Text style={{ fontWeight: 600 }}>{r.tipo_resultado}</Text>
          <Text style={[s.tenue, { marginTop: 4 }]}>{EXPLICACION[r.tipo_resultado]}</Text>
        </View>

        <View style={s.seccion}>
          <Text style={s.h2}>Cómo se llegó a esta recomendación</Text>
          <Text style={s.tenue}>El test combina tres mediciones. Estos son tus números en cada una y la regla que decidió tu resultado.</Text>

          <View style={{ marginTop: 10 }} wrap={false}>
            <Text style={s.h3}>1. Interés directo por especialidad</Text>
            <Text style={s.chico}>Promedio de tus respuestas a las actividades de cada especialidad (de 1 a 5). Se recomienda la de mayor interés si llega a {UMBRALES.interesAlto}; la línea marca ese mínimo.</Text>
            {d.interes.map((e) => (
              <View key={e.clave} style={{ marginTop: 6 }}>
                <View style={s.fila}>
                  <Text style={{ fontWeight: 600 }}>{e.nombre}</Text>
                  <Text>{e.valor.toFixed(2)} de 5, interés {nivel(e.valor)}</Text>
                </View>
                <View style={s.barra}>
                  <View style={{ width: `${((e.valor - 1) / 4) * 100}%`, height: 6, borderRadius: 3, backgroundColor: e.color ? C.especialidad[e.color] : C.primary }} />
                  <View style={{ position: "absolute", left: `${((UMBRALES.interesAlto - 1) / 4) * 100}%`, top: -2, width: 1, height: 10, backgroundColor: C.texto }} />
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 12 }} wrap={false}>
            <Text style={s.h3}>2. Tu perfil RIASEC</Text>
            <Text style={s.chico}>
              Tu código {r.codigo_riasec} son tus tres dimensiones más altas. Un perfil es plano si la más alta queda por debajo de {UMBRALES.planoMax.toFixed(1)} o si entre la más alta y la más baja hay menos de {UMBRALES.planoRango} puntos.
            </Text>
            <Text style={{ marginTop: 3 }}>
              Dimensión más alta: {d.maxDim.toFixed(2)}. Diferencia entre la más alta y la más baja: {(d.maxDim - d.minDim).toFixed(2)}. Perfil plano: {r.perfil_plano ? "sí" : "no"}.
            </Text>
          </View>

          <View style={{ marginTop: 12 }} wrap={false}>
            <Text style={s.h3}>3. Congruencia con cada especialidad</Text>
            <Text style={s.chico}>
              Compara tu código, letra por letra, con el de cada especialidad en el hexágono de Holland. 18 puntos es coincidencia total; {UMBRALES.congruenciaAlta} o más es alta y {UMBRALES.congruenciaMedia} o más es media.
            </Text>
            <View style={[s.fila, s.celda, { marginTop: 4 }]}>
              <Text style={[s.tenue, { width: "40%" }]}>Especialidad</Text>
              <Text style={[s.tenue, { width: "18%" }]}>Su código</Text>
              <Text style={[s.tenue, { width: "18%" }]}>Tu código</Text>
              <Text style={[s.tenue, { width: "24%", textAlign: "right" }]}>Congruencia</Text>
            </View>
            {d.congruencias.map((c) => (
              <View key={c.nombre} style={[s.fila, s.celda]}>
                <Text style={{ width: "40%", fontWeight: 600 }}>{c.nombre}</Text>
                <Text style={{ width: "18%", letterSpacing: 1.5 }}>{c.codigo}</Text>
                <Text style={{ width: "18%", letterSpacing: 1.5 }}>{r.codigo_riasec}</Text>
                <Text style={{ width: "24%", textAlign: "right" }}>{c.puntos} de 18 ({nivelCongruencia(c.puntos)})</Text>
              </View>
            ))}
          </View>

          <View style={s.recuadro} wrap={false}>
            <Text style={{ fontWeight: 700, fontSize: 9 }}>La regla que decidió tu resultado</Text>
            <Text style={{ marginTop: 2 }}>{d.regla}</Text>
          </View>
        </View>

        <View style={s.seccion} break>
          <Text style={s.h2}>Tus seis dimensiones</Text>
          <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
            <Hexagono dimensiones={p.dimensiones} />
            <View style={{ flex: 1 }}>
              {ORDEN_RIASEC.map((dim) => (
                <View key={dim} style={[s.fila, s.celda, { gap: 8 }]} wrap={false}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 700, color: C.dim[dim] }}>{DIMENSIONES[dim]} ({dim})</Text>
                    <Text style={s.chico}>{DESCRIPCION_DIMENSION[dim]}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: 700 }}>{(p.dimensiones[dim] ?? 0).toFixed(2)}</Text>
                    <Text style={s.chico}>{nivel(p.dimensiones[dim] ?? 0)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={s.seccion} wrap={false}>
          <Text style={s.h2}>Comentario de A.N.A</Text>
          <Text style={s.chico}>
            Generado con inteligencia artificial a partir de tus puntajes y de marcos de competencias del área. Es una orientación, no una decisión: coméntalo con tu tutor o tu coordinación de carrera.
          </Text>
          {ia ? (
            <>
              <Text style={{ marginTop: 6 }}>{ia.resumen}</Text>
              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                {listas.map(([titulo, items]) => (
                  <View key={titulo} style={{ flex: 1 }}>
                    <Text style={s.h3}>{titulo}</Text>
                    {items.map((x) => (
                      <Text key={x} style={{ fontSize: 9, marginTop: 2 }}>• {x}</Text>
                    ))}
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={[s.tenue, { marginTop: 6 }]}>
              El comentario de A.N.A no estaba disponible al generar este informe. El resto del informe es válido; puedes volver a descargarlo más tarde para incluirlo.
            </Text>
          )}
        </View>

        {/* shortcut: sin número de página; el texto dinámico (render) de @react-pdf 4.9 vacía el pie. Reintentar al actualizar la librería */}
        <Text style={[s.pie, { left: 44, right: 44 }]} fixed>
          CorePath, Instituto Tecnológico de Mérida (TecNM). Basado en el modelo RIASEC de John L. Holland.
        </Text>
      </Page>
    </Document>
  );
}

/** Llena la plantilla con los datos del resultado y descarga el PDF. */
export async function descargarInforme(r: Resultado, ia: InformeIA | null, correo: string) {
  const blob = await pdf(<InformeDocumento r={r} ia={ia} correo={correo} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `informe-corepath-${r.creado_en.slice(0, 10)}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
