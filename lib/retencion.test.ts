// Ejecutar: node lib/retencion.test.ts
import assert from "node:assert/strict";
import { diasRestantes, fechaBorrado } from "./retencion.ts";

const creado = "2026-10-01T12:00:00Z";
assert.equal(diasRestantes(creado, new Date("2026-10-01T12:00:00Z")), 30); // recién creado
assert.equal(diasRestantes(creado, new Date("2026-10-01T13:00:00Z")), 30); // horas después: aún 30 (redondeo hacia arriba)
assert.equal(diasRestantes(creado, new Date("2026-10-30T12:00:00Z")), 1);
assert.equal(diasRestantes(creado, new Date("2026-10-31T11:00:00Z")), 1); // falta menos de un día
assert.equal(diasRestantes(creado, new Date("2026-10-31T12:00:00Z")), 0);
assert.equal(diasRestantes(creado, new Date("2026-11-15T00:00:00Z")), 0); // nunca negativo
assert.equal(fechaBorrado(creado).toISOString(), "2026-10-31T12:00:00.000Z");
console.log("retencion OK");
