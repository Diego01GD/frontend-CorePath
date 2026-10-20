<div align="center">

<img src="public/images/Lobo_Tec_SF.png" alt="A.N.A, orientadora vocacional de CorePath" width="160" />

# CorePath · Frontend

**Asistente Virtual Vocacional del Instituto Tecnológico de Mérida**

Ayuda a los estudiantes de **Ingeniería en Sistemas Computacionales** a elegir su especialidad
mediante un test de intereses basado en **RIASEC** y una orientadora virtual con IA.

![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![daisyUI](https://img.shields.io/badge/daisyUI-5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-14-0055FF?style=for-the-badge&logo=framer&logoColor=white)

![Estado](https://img.shields.io/badge/estado-en_desarrollo-orange?style=flat-square)
![Residencia](https://img.shields.io/badge/proyecto-residencia_profesional-a34e1c?style=flat-square)

</div>

---

## Contenido

- [Descripción](#-descripción)
- [Estado actual](#-estado-actual)
- [Requerimientos funcionales](#-requerimientos-funcionales)
- [Requerimientos no funcionales](#-requerimientos-no-funcionales)
- [Fuera de alcance](#-fuera-de-alcance-lo-que-no-hace)
- [Rutas](#-rutas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Integración con el backend](#-integración-con-el-backend)
- [Sistema de diseño](#-sistema-de-diseño)
- [Equipo](#-equipo)

---

## Descripción

CorePath es la interfaz web del asistente vocacional. El estudiante:

1. **Inicia sesión** con su cuenta institucional de Microsoft (solo correos del Tec).
2. **Responde el test vocacional** (escala Likert 1–5) basado en el modelo **RIASEC** de Holland.
3. **Recibe una recomendación** entre las especialidades **Ciberseguridad**, **Desarrollo Web y Móvil** e **Inteligencia Artificial**, junto con su perfil de intereses.
4. **Conversa con A.N.A**, la orientadora virtual, que responde con información de marcos de referencia (NICE, EDISON, SFIA) y del mercado laboral, usando un modelo de lenguaje local con RAG.

Este repositorio contiene **solo el frontend**. La calificación del test, el chatbot y la base de datos viven en el backend (FastAPI + ChromaDB + Ollama + Supabase).

---

## Estado actual

| Área | Estado |
| --- | --- |
| Páginas públicas (inicio, nosotros, preguntas frecuentes, políticas, 404) | Terminadas |
| Vistas de login (inicio de sesión, éxito, error) | Solo interfaz; sin conexión a Microsoft |
| Vista `/comenzar` | Terminada |
| Test vocacional | Provisional (preguntas de ejemplo) |
| Chat con A.N.A | Provisional (no llama a la API) |
| Protección de rutas | Pendiente |
| Avatar animado (Rive) | Pendiente |


---

##  Requerimientos funcionales

| ID | Requerimiento | Estado |
| --- | --- | --- |
| RF-01 | Mostrar una página de inicio que presente el asistente, sus pasos y el acceso al test y al chat. | ✅ |
| RF-02 | Mostrar páginas informativas: **Nosotros** y **Preguntas frecuentes**. | ✅ |
| RF-03 | Mostrar el **Aviso de privacidad** y la **Política de uso**. | ✅ (el contenido debe actualizarse: borrado a 30 días, datos que entrega Microsoft, responsable y correo ARCO) |
| RF-04 | Permitir iniciar sesión **únicamente con cuenta institucional de Microsoft** (Azure / Entra ID vía Supabase Auth). | ⏳ El botón existe; falta la integración |
| RF-05 | Exigir la aceptación del aviso de privacidad y la política de uso antes de iniciar sesión. | 🟡 Se bloquea el botón; falta registrar la aceptación en la base de datos |
| RF-06 | Informar el resultado del inicio de sesión: éxito o error (cuenta no autorizada, cancelado, falla del servidor). | 🟡 Vistas listas; falta la ruta `/auth/callback` y el motivo del error |
| RF-07 | Redirigir al usuario a `/comenzar` al iniciar sesión, donde elige entre el test y el chat. | 🟡 Vista lista; falta la redirección |
| RF-08 | Impedir el acceso a `/comenzar`, `/test` y `/chat` sin sesión (redirige a `/login`). | ⏳ |
| RF-09 | Mostrar el test con los ítems que entrega el backend (`GET /api/test/items`) y respuesta Likert 1–5. | ⏳ |
| RF-10 | Enviar las respuestas (`POST /api/test`) y mostrar el resultado: especialidad recomendada, código RIASEC, perfil por dimensión y nivel de congruencia. | ⏳ |
| RF-11 | Permitir conversar con A.N.A (`POST /api/chat`), indicando el área de interés y enviando el historial de la conversación. | ⏳ |
| RF-12 | Mostrar un indicador de "pensando" mientras se genera la respuesta del chat. | ⏳ |
| RF-13 | Animar el avatar según el estado de la conversación (`idle`, `thinking`, `talking`, `error`). | ⏳ |
| RF-14 | Mostrar el estado de la sesión en el encabezado y permitir cerrar sesión. | ⏳ |
| RF-15 | Cambiar entre tema claro y oscuro y recordar la preferencia. | ✅ |
| RF-16 | Mostrar una página 404 personalizada. | ✅ |

---

## ⚙️ Requerimientos no funcionales

| ID | Categoría | Requerimiento | Estado |
| --- | --- | --- | --- |
| RNF-01 | 📱 Usabilidad | Diseño adaptable a móvil, tableta y escritorio, sin desplazamiento horizontal. | ✅ Revisado a 390 px y 1280 px |
| RNF-02 | ♿ Accesibilidad | Etiquetas ARIA, navegación por teclado, contraste suficiente y respeto a "reducir movimiento" (`prefers-reduced-motion`). | 🟡 Aplicado en componentes; falta una auditoría WCAG 2.2 completa |
| RNF-03 | ⚡ Rendimiento | Páginas estáticas prerenderizadas, fuentes con `next/font`, imágenes con `next/image` y animaciones que no redibujan la página. | ✅ |
| RNF-04 | 🌗 Experiencia | El tema se aplica antes del primer pintado (sin parpadeo). | ✅ |
| RNF-05 | 🔒 Seguridad | Ningún secreto en el frontend: solo variables públicas (`NEXT_PUBLIC_*`); la sesión viaja en cookies gestionadas por Supabase y el token al backend en el header `Authorization`. | ⏳ Se aplica al integrar Supabase |
| RNF-06 | 🔒 Seguridad | Solo cuentas del tenant institucional de Microsoft; el backend vuelve a validar el dominio del correo. | ⏳ |
| RNF-07 | 🛡️ Privacidad | Cumplir la LGPDPPSO: aviso de privacidad visible antes del registro y resultados borrados a los 30 días (lo hace el backend). | 🟡 |
| RNF-08 | 🌐 Idioma | Interfaz completamente en español. | ✅ |
| RNF-09 | 🧹 Mantenibilidad | TypeScript en modo estricto, ESLint sin errores y estructura por grupos de rutas. | ✅ |
| RNF-10 | 🖥️ Compatibilidad | Navegadores modernos (Chrome, Edge, Firefox, Safari, últimas 2 versiones). | ✅ |
| RNF-11 | ⏱️ Tiempo de respuesta | El chat puede tardar ~30 s (modelo local); la interfaz debe indicarlo y no bloquearse. | ⏳ |

---

## 🚫 Fuera de alcance (lo que NO hace)

- ❌ **No califica el test.** La calificación RIASEC, los umbrales y la recomendación se calculan en el backend.
- ❌ **No guarda datos del estudiante** en el navegador ni en una base de datos propia (solo la preferencia de tema en `localStorage`); los resultados se guardan en Supabase desde el backend.
- ❌ **No genera respuestas de IA.** El chat solo envía la pregunta al backend y muestra la respuesta.
- ❌ **No permite registrarse con correo y contraseña** ni con cuentas personales (Gmail, Outlook personal, etc.).
- ❌ **No tiene panel de administración** para editar ítems o ver estadísticas.
- ❌ **No cubre otras carreras** ni especialidades distintas a las tres de Sistemas Computacionales.
- ❌ **No es una app móvil nativa**; es una aplicación web adaptable.

---

## 🗺️ Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | 🌐 Público | Página de inicio |
| `/nosotros` | 🌐 Público | Equipo y propuesta de valor |
| `/preguntas-frecuentes` | 🌐 Público | Preguntas frecuentes |
| `/politica-privacidad` | 🌐 Público | Aviso de privacidad |
| `/politica-uso` | 🌐 Público | Política de uso |
| `/login` | 🌐 Público | Aceptación de políticas e inicio de sesión con Microsoft |
| `/login/exito` | 🌐 Público | Sesión iniciada correctamente |
| `/login/error` | 🌐 Público | Cuenta no autorizada |
| `/comenzar` | 🔐 Protegida* | Elegir entre test y chat |
| `/test` | 🔐 Protegida* | Test vocacional (provisional) |
| `/chat` | 🔐 Protegida* | Chat con A.N.A (provisional) |

\* La protección se implementará con `proxy.ts` y un layout de servidor cuando se integre Supabase Auth.

---

## 📂 Estructura del proyecto

```
frontend/
├── app/
│   ├── (public)/               # Rutas públicas (con encabezado y menú)
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Inicio
│   │   ├── login/              # Login, éxito y error
│   │   ├── nosotros/
│   │   ├── preguntas-frecuentes/
│   │   ├── politica-privacidad/
│   │   └── politica-uso/
│   ├── (protected)/            # Rutas que requerirán sesión
│   │   ├── layout.tsx          # Encabezado con "← Inicio"
│   │   ├── comenzar/
│   │   ├── test/
│   │   └── chat/
│   ├── components/             # Componentes compartidos
│   │   ├── entrance-animation.tsx
│   │   ├── header.tsx · logo.tsx · menu.tsx
│   │   ├── theme-control.tsx
│   │   └── tv-notfound.tsx
│   ├── globals.css             # Tokens de color, tema y estilos del 404
│   ├── layout.tsx              # Layout raíz: fuentes, metadatos y script de tema
│   └── not-found.tsx
├── public/images/              # Logo, mascota y recursos
├── next.config.ts
└── package.json
```

---

## 🚀 Instalación y ejecución

**Requisitos:** Node.js 20 o superior y npm.

```bash
npm install        # instala dependencias
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run build      # compilación de producción
npm start          # sirve la compilación
npm run lint       # revisión con ESLint
```

### 🔧 Variables de entorno (al integrar Supabase y el backend)

Crear `.env.local` (no se sube al repositorio):

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

> ⚠️ Nunca pongas la llave `service_role` de Supabase en el frontend.

---

## 🔌 Integración con el backend

| Método | Endpoint | Uso | Autenticación |
| --- | --- | --- | --- |
| `GET` | `/api/test/items?version=B` | Ítems del test | `Authorization: Bearer <token>` |
| `POST` | `/api/test` | Calificar y guardar el test | `Authorization: Bearer <token>` |
| `POST` | `/api/chat` | Pregunta a A.N.A (`mensaje`, `area`, `historial`) | — |

- El `area` del chat debe ser `ciberseguridad`, `desarrollo` o `ia`; el resultado del test devuelve el `area` sugerida.
- La respuesta del chat incluye `estado_avatar` (`talking` o `error`) para animar a A.N.A.

### 🔐 Flujo de inicio de sesión previsto

```
Botón "Continuar con Microsoft"
  → Microsoft (tenant institucional)
  → https://<proyecto>.supabase.co/auth/v1/callback
  → /auth/callback (esta app)
  → /comenzar   (éxito)
  → /login/error?motivo=...   (error)
```

---

## 🎨 Sistema de diseño

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `primary` | `#a34e1c` | `#e0185a` | Botones y enlaces |
| `primary-h` | `#8a4116` | `#b30c44` | Hover |
| `accent` | `#c2385f` | `#e3b47c` | Nombre de A.N.A, chat |
| `background` | `#f2e3d0` | `#16171c` | Fondo |
| `cards` | `#fbf6ef` | `#202229` | Tarjetas y encabezado |
| `success` / `error` | `#4e7d2a` / `#b42318` | igual | Estados |
| `cib` / `web` / `ia` | `#7c3aed` / `#b45309` / `#0e7490` | igual | Color por especialidad |

- **Tipografías:** Fraunces (títulos) y Plus Jakarta Sans (textos).
- **Animaciones:** `EntranceAnimation` (framer-motion) respeta `prefers-reduced-motion`.
- Los colores de daisyUI (`btn-primary`, etc.) se reasignan a estos tokens en `globals.css`.

---

## 👥 Equipo

| | Integrante | Rol |
| --- | --- | --- |
| 🎨 | Diego Alejandro Tzec Ku | Diseño UI/UX y Frontend |
| 🤖 | Angel Josue Lopez Castilla | IA y Backend |

<div align="center">

Hecho en el **Instituto Tecnológico de Mérida** · TecNM 🐺

</div>
