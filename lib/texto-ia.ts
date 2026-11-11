// Convierte el texto del modelo (markdown sencillo) en bloques: párrafos y listas. Sin HTML: React escapa todo.
export type Bloque = { tipo: "p"; texto: string } | { tipo: "lista"; items: string[] };

export function bloquesIA(texto: string): Bloque[] {
  const bloques: Bloque[] = [];
  let lista: string[] | null = null;
  for (const linea of texto.split("\n")) {
    const s = linea.trim();
    if (!s) {
      lista = null;
      continue;
    }
    const item = s.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (item) {
      if (!lista) bloques.push({ tipo: "lista", items: (lista = []) });
      lista.push(item[1]);
    } else {
      lista = null;
      // Los encabezados "###" del modelo se muestran como texto normal: la vista ya pone sus propios títulos
      bloques.push({ tipo: "p", texto: s.replace(/^#+\s*/, "") });
    }
  }
  return bloques;
}

// "**negritas**" -> partes alternadas; las impares van en <strong>
export const partesNegritas = (s: string) => s.split(/\*\*(.+?)\*\*/g);
