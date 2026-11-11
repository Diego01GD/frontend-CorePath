export type Progreso = { indice: number; respuestas: Record<string, number> };

// Borrador por usuario y versión en sessionStorage: sobrevive a una recarga, pero se borra al cerrar la pestaña
// y caduca a las 2 h, para que en un laboratorio compartido el siguiente alumno no vea respuestas ajenas.
// El navegador no es fuente de verdad: el backend valida todo. Prueba: node lib/progreso-test.test.ts
export const CADUCIDAD_MS = 2 * 60 * 60 * 1000;
export const PREFIJO = "corepath:test:";

export const claveProgreso = (usuario: string, version: string) => `${PREFIJO}${usuario}:${version}`;

export function leerProgreso(clave: string, ahora = Date.now()): Progreso | null {
  try {
    // shortcut: borra los borradores de versiones anteriores que vivían en localStorage; quitar al cerrar el semestre
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIJO)).forEach((k) => localStorage.removeItem(k));
    const p = JSON.parse(sessionStorage.getItem(clave) ?? "null");
    const valido = p && typeof p.indice === "number" && typeof p.respuestas === "object" && typeof p.guardado === "number";
    if (valido && ahora - p.guardado < CADUCIDAD_MS) return { indice: p.indice, respuestas: p.respuestas };
    sessionStorage.removeItem(clave);
    return null;
  } catch {
    return null; // almacenamiento bloqueado o borrador corrupto: se empieza de cero
  }
}

export function guardarProgreso(clave: string, progreso: Progreso | null, ahora = Date.now()) {
  try {
    if (progreso) sessionStorage.setItem(clave, JSON.stringify({ ...progreso, guardado: ahora }));
    else sessionStorage.removeItem(clave);
  } catch {
    // Modo privado o almacenamiento bloqueado o lleno: el test sigue funcionando, solo no se recupera al recargar
  }
}

// Al cerrar sesión: en una computadora compartida, el siguiente alumno no debe ver respuestas a medias de otro
export function borrarProgresos() {
  try {
    for (const almacen of [sessionStorage, localStorage]) // localStorage: borradores de versiones anteriores
      Object.keys(almacen).filter((k) => k.startsWith(PREFIJO)).forEach((k) => almacen.removeItem(k));
  } catch {}
}
