// Ejecutar: node lib/progreso-test.test.ts
import assert from "node:assert/strict";

// Web Storage mínimo en memoria (Node no lo trae); Object.keys debe listar las claves como en el navegador
function almacen() {
  const s: Record<string, unknown> = {};
  Object.defineProperties(s, {
    getItem: { value: (k: string) => (k in s ? String(s[k]) : null) },
    setItem: { value: (k: string, v: string) => (s[k] = String(v)) },
    removeItem: { value: (k: string) => delete s[k] },
  });
  return s as unknown as Storage;
}
Object.assign(globalThis, { sessionStorage: almacen(), localStorage: almacen() });

const { leerProgreso, guardarProgreso, borrarProgresos, claveProgreso, CADUCIDAD_MS } = await import("./progreso-test.ts");

const a = claveProgreso("alumnoA", "v1");
const b = claveProgreso("alumnoB", "v1");
const t0 = 1_000_000;
const respuestas = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`R${i}`, 3]));

guardarProgreso(a, { indice: 9, respuestas }, t0);
assert.deepEqual(leerProgreso(a, t0 + 1000), { indice: 9, respuestas }); // se recupera tras recargar
assert.equal(leerProgreso(b, t0), null); // otro usuario no ve el borrador de A
assert.equal(leerProgreso(claveProgreso("alumnoA", "v2"), t0), null); // otra versión del test: se descarta

assert.equal(leerProgreso(a, t0 + CADUCIDAD_MS), null); // caducado a las 2 h
assert.equal(sessionStorage.getItem(a), null); // y eliminado

sessionStorage.setItem(a, "{no es json");
assert.equal(leerProgreso(a, t0), null); // corrupto: no rompe

localStorage.setItem("corepath:test:viejo:v0", "{}");
localStorage.setItem("theme", "dark");
leerProgreso(a, t0);
assert.equal(localStorage.getItem("corepath:test:viejo:v0"), null); // borradores antiguos de localStorage, fuera
assert.equal(localStorage.getItem("theme"), "dark"); // lo demás no se toca

guardarProgreso(a, { indice: 1, respuestas: {} }, t0);
sessionStorage.setItem("otro-sitio", "x");
borrarProgresos();
assert.equal(sessionStorage.getItem(a), null);
assert.equal(sessionStorage.getItem("otro-sitio"), "x"); // solo las claves del proyecto

Object.defineProperty(globalThis, "sessionStorage", { get() { throw new Error("bloqueado"); } });
assert.equal(leerProgreso(a, t0), null); // almacenamiento no disponible: sin errores
guardarProgreso(a, { indice: 0, respuestas: {} }, t0);
console.log("progreso-test OK");
