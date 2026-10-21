<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

## Proyecto: CorePath (frontend)

Asistente vocacional del Instituto Tecnológico de Mérida. Ver `README.md` para requerimientos y estado.

### Contexto
- Solo frontend. La calificación del test RIASEC, el chatbot (RAG + Ollama) y la base de datos (Supabase) están en el backend FastAPI; aquí no se replica esa lógica.
- Contrato del backend (todos requieren `Authorization: Bearer <token de Supabase>`): `GET /api/test/items`, `POST /api/test` y `POST /api/chat` (`mensaje` ≤ 1000, `area` = `ciberseguridad` | `desarrollo` | `ia`, `historial` ≤ 20 con `role` = `user` | `assistant`). Llamarlos solo con `lib/api.ts`.
- Login: Microsoft (Azure / Entra ID) vía Supabase Auth, activado con `NEXT_PUBLIC_LOGIN_MICROSOFT`; mientras tanto, enlace por correo (temporal, marcado con `shortcut:` en `login/page.tsx`). Ambos vuelven a `/auth/callback`, que redirige a `/comenzar`.
- `/test` y `/chat` son provisionales; no tratarlas como diseño final.

### Convenciones
- Todo el texto de la interfaz va en **español**.
- Rutas en grupos: `app/(public)` (con `Header`) y `app/(protected)` (encabezado con "← Inicio" y cerrar sesión). La protección está en `proxy.ts` (en Next 16 reemplaza a `middleware`) **y** en `app/(protected)/layout.tsx`; mantener ambas. Rutas protegidas nuevas: agregarlas a `RUTAS_PROTEGIDAS` en `lib/auth.ts`.
- Con `cacheComponents`, leer la sesión (`cookies()`, `getClaims()`) solo dentro de `<Suspense>`; ver `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`.
- Supabase: clientes en `lib/supabase/` (`client.ts` navegador, `server.ts` servidor, `proxy.ts` refresco). Para verificar identidad usar `getClaims()`, nunca `getSession()` en el servidor.
- La CSP está en `next.config.ts`: un servicio externo nuevo (Rive, analíticas, otra API) debe agregarse a `connect-src`/`script-src` o el navegador lo bloqueará.
- Componentes compartidos en `app/components/`, nombres de archivo en kebab-case.
- Colores solo con los tokens de `globals.css` (`primary`, `accent`, `cards`, `ctext`, ...). Usar `primary/15` en lugar de `primary-l` para fondos suaves: en tema oscuro `primary-l` es un rosa intenso con poco contraste.
- Los colores de daisyUI se reasignan a los tokens en `globals.css`; no quitar ese bloque o `btn-primary` vuelve a ser morado.
- El tema lo aplica el script inline de `app/layout.tsx` antes del primer pintado; `ThemeControl` solo lo alterna. Mantener ambos sincronizados.
- Animaciones de entrada con `EntranceAnimation` (respeta `prefers-reduced-motion`). Para animaciones continuas usar motion values de framer-motion, no `setState` en `requestAnimationFrame`.
- La orientadora se llama **A.N.A**.

### Antes de entregar cambios
- `npm run lint` y `npm run build` sin errores.
- Revisar en móvil (≈390 px) y escritorio, en tema claro y oscuro.
- No agregar dependencias sin necesidad. No subir `.env*` ni secretos; en el frontend solo variables `NEXT_PUBLIC_*` (nunca la `service_role` de Supabase).
