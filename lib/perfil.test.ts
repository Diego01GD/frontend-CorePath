// Ejecutar: node lib/perfil.test.ts
import assert from "node:assert/strict";
import { lecturaPerfil, opcionCercana, resumenPerfil } from "./perfil.ts";

const ESP = [
  { clave: "CIB", nombre: "Ciberseguridad", area: "ciberseguridad", riasec: "ICR", color: "c" },
  { clave: "WEB", nombre: "Desarrollo Web y Móvil", area: "desarrollo", riasec: "IRA", color: "w" },
  { clave: "IA", nombre: "Inteligencia Artificial", area: "ia", riasec: "IRS", color: "i" },
];

// Opción cercana: solo si la segunda queda a menos del margen
const interes = { Ciberseguridad: 3.9, "Desarrollo Web/Móvil": 4.1, "Inteligencia Artificial": 2.5 };
assert.deepEqual(opcionCercana(interes, "Desarrollo Web/Móvil", 0.5)?.clave, "Ciberseguridad");
assert.ok(Math.abs(opcionCercana(interes, "Desarrollo Web/Móvil", 0.5)!.margen - 0.2) < 1e-9);
assert.equal(opcionCercana(interes, "Desarrollo Web/Móvil", 0.1), null);
assert.equal(opcionCercana(interes, "No existe", 0.5), null);
// Empate exacto: la otra empatada es la opción cercana
assert.equal(opcionCercana({ a: 3, b: 3, c: 2 }, "a", 0.5)?.clave, "b");

// Lectura del perfil: I y R en las tres, A solo en Web, E en ninguna
const l = lecturaPerfil("IAE", ESP);
assert.equal(l[0].especialidades.length, 3);
assert.deepEqual(l[1].especialidades.map((e) => e.nombre), ["Desarrollo Web y Móvil"]);
assert.ok(l[1].especialidades[0].texto.includes("interfaces"));
assert.equal(l[2].especialidades.length, 0);
assert.ok(l[2].nota);
assert.ok(l.every((x) => x.especialidades.every((e) => e.texto.length > 0)));

assert.equal(resumenPerfil(lecturaPerfil("IRA", ESP), 3), "Tu I y tu R están en las 3 especialidades y tu A es propia de Desarrollo Web y Móvil.");
assert.equal(resumenPerfil(lecturaPerfil("SEC", ESP), 3), "Tu S es propia de Inteligencia Artificial y tu C es propia de Ciberseguridad.");
assert.equal(resumenPerfil(lecturaPerfil("E", ESP), 3), "Las letras de tu código no son exclusivas de ninguna especialidad.");
console.log("perfil OK");
