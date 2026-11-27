// Los dos resultados del test (misma lógica v5 del backend, app/services/perfil.py):
// 1) la especialidad por interés decide; 2) el perfil RIASEC explica, letra por letra, sin cambiar la recomendación.
// Sin imports de ejecución para poder probarlo con `node lib/perfil.test.ts`.

export type EspecialidadPerfil = { clave: string; nombre: string; area: string; riasec: string; color: string };

export type LetraPerfil = {
  letra: string;
  dimension: string;
  especialidades: { nombre: string; color: string; texto: string }[];
  nota?: string; // letra que no está en el código de ninguna especialidad
};

const DIMENSION: Record<string, string> = {
  R: "Realista", I: "Investigador", A: "Artístico", S: "Social", E: "Emprendedor", C: "Convencional",
};

// Cómo se usa cada letra en cada especialidad. Solo combinaciones presentes en los códigos ICR, IRA e IRS.
const TEXTO_LETRA: Record<string, Record<string, string>> = {
  I: {
    ciberseguridad: "investigar vulnerabilidades y rastrear el origen de un ataque",
    desarrollo: "resolver problemas de programación y entender cómo funciona una app por dentro",
    ia: "analizar datos y entender por qué un modelo da cierto resultado",
  },
  R: {
    ciberseguridad: "configurar redes, firewalls y equipos de forma práctica",
    desarrollo: "construir, instalar y probar aplicaciones en dispositivos y servidores reales",
    ia: "montar el entorno, entrenar modelos y ponerlos a funcionar",
  },
  C: { ciberseguridad: "seguir normas y estándares, auditar y documentar con precisión" },
  A: { desarrollo: "diseñar interfaces y experiencias de usuario" },
  S: { ia: "pensar en las personas que usan la IA: asistentes, ética y explicar resultados" },
};

const NOTA_SIN_ESPECIALIDAD =
  "No está en el código de ninguna de las tres especialidades, pero en cualquiera te ayuda a liderar proyectos, emprender o tratar con clientes.";

/** Segunda especialidad si su interés queda a menos de `margenMax` de la recomendada. */
export function opcionCercana(interes: Record<string, number>, ganadora: string, margenMax: number) {
  const resto = Object.entries(interes).filter(([k]) => k !== ganadora).sort(([, a], [, b]) => b - a);
  if (!(ganadora in interes) || resto.length === 0) return null;
  const margen = interes[ganadora] - resto[0][1];
  return margen < margenMax ? { clave: resto[0][0], valor: resto[0][1], margen } : null;
}

/** Para cada letra del código del alumno, qué especialidades la comparten y para qué les sirve. */
export function lecturaPerfil(codigo: string, especialidades: EspecialidadPerfil[]): LetraPerfil[] {
  return codigo.split("").map((letra) => {
    const con = especialidades.filter((e) => e.riasec.includes(letra));
    return {
      letra,
      dimension: DIMENSION[letra] ?? letra,
      especialidades: con.map((e) => ({ nombre: e.nombre, color: e.color, texto: TEXTO_LETRA[letra]?.[e.area] ?? "" })),
      ...(con.length === 0 && { nota: NOTA_SIN_ESPECIALIDAD }),
    };
  });
}

/** Una frase que resume qué letras son comunes a las tres y cuáles son propias de una. */
export function resumenPerfil(letras: LetraPerfil[], total: number): string {
  const comunes = letras.filter((l) => l.especialidades.length === total).map((l) => l.letra);
  const propias = letras.filter((l) => l.especialidades.length === 1);
  const partes: string[] = [];
  if (comunes.length)
    partes.push(`${unir(comunes.map((l) => `tu ${l}`))} ${comunes.length === 1 ? "está" : "están"} en las ${total} especialidades`);
  for (const l of propias) partes.push(`tu ${l.letra} es propia de ${l.especialidades[0].nombre}`);
  if (!partes.length) return "Las letras de tu código no son exclusivas de ninguna especialidad.";
  const frase = unir(partes);
  return frase[0].toUpperCase() + frase.slice(1) + ".";
}

const unir = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}`);
