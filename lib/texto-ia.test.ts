// Ejecutar: node lib/texto-ia.test.ts
import assert from "node:assert/strict";
import { bloquesIA, partesNegritas } from "./texto-ia.ts";

assert.deepEqual(bloquesIA("### Título\nUn párrafo.\n\n- uno\n* dos\n• tres\nOtro"), [
  { tipo: "p", texto: "Título" },
  { tipo: "p", texto: "Un párrafo." },
  { tipo: "lista", items: ["uno", "dos", "tres"] },
  { tipo: "p", texto: "Otro" },
]);
assert.deepEqual(bloquesIA("1. a\n2) b\n\n- c"), [
  { tipo: "lista", items: ["a", "b"] },
  { tipo: "lista", items: ["c"] },
]);
assert.deepEqual(bloquesIA("  \n\n"), []);
assert.deepEqual(partesNegritas("Gana **$20,000** al mes con **Python**"), ["Gana ", "$20,000", " al mes con ", "Python", ""]);
assert.deepEqual(partesNegritas("sin negritas"), ["sin negritas"]);
console.log("texto-ia: ok");
