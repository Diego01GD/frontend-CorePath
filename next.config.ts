import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";
const origen = (url?: string) => {
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
};

// CSP: el navegador solo habla con este sitio, Supabase y el backend. 'unsafe-inline' es necesario
// para el script del tema y los scripts de Next sin nonces (los nonces obligarían a render dinámico).
// shortcut: al agregar Rive, sumar su CDN a connect-src
const csp = [
  "default-src 'self'",
  // 'wasm-unsafe-eval': el motor de diseño de @react-pdf (yoga) es WebAssembly; no habilita eval() de JavaScript
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // data: = módulo WebAssembly de @react-pdf incrustado (local, no sale a la red)
  `connect-src 'self' data: ${origen(process.env.NEXT_PUBLIC_SUPABASE_URL)} ${origen(process.env.NEXT_PUBLIC_API_URL)}${dev ? " ws:" : ""}`,
  "worker-src 'self' blob:", // @react-pdf genera el PDF en un worker creado desde blob:
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
