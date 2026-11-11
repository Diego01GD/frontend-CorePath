"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import EntranceAnimation from "../../components/entrance-animation";
import { consentimientoPrevio, marcarConsentimiento } from "@/lib/consentimiento";
import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedUsage, setAcceptedUsage] = useState(false);
  const acceptedPolicies = acceptedPrivacy && acceptedUsage;
  const [redirigiendo, setRedirigiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Si ya aceptó la versión vigente en este navegador, las casillas aparecen marcadas (puede desmarcarlas)
  useEffect(() => {
    if (consentimientoPrevio()) queueMicrotask(() => { setAcceptedPrivacy(true); setAcceptedUsage(true); });
  }, []);

  // Único acceso: cuenta institucional de Microsoft (Azure / Entra ID) vía Supabase Auth
  const loginMicrosoft = async () => {
    setMensaje("");
    setRedirigiendo(true);
    marcarConsentimiento();
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "azure",
      options: { scopes: "email", redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setRedirigiendo(false);
      setMensaje("No se pudo abrir el inicio de sesión de Microsoft. Intenta de nuevo en unos minutos.");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-6rem)] w-full flex-col items-stretch justify-center lg:flex-row">
      <EntranceAnimation className="flex min-h-80 w-full items-center justify-center lg:bg-primary-l lg:min-h-[calc(100vh-5rem)] lg:w-1/2">
        <Image
          src="/images/Lobo_Tec_SF.png"
          alt="A.N.A"
          width={300}
          height={300}
        />
      </EntranceAnimation>

      <EntranceAnimation delay={0.12} className="flex w-full items-center justify-center px-6 py-8 lg:p-0 lg:min-h-[calc(100vh-5rem)] lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Acceso a CorePath
            </p>
            <h1 className="font-titulos text-4xl font-bold">
              Comienza tu camino
            </h1>
            <p className="mt-4 text-sm leading-6 text-ctext/70">
              Inicia sesión con tu cuenta institucional de Microsoft para
              conservar tu progreso y recuperar tu nombre de usuario.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-5">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(event) => setAcceptedPrivacy(event.target.checked)}
                className="checkbox checkbox-primary mt-0.5"
              />
              <span>
                Acepto la{" "}
                <Link
                  href="/politica-privacidad"
                  className="font-bold text-primary underline"
                >
                  Política de privacidad
                </Link>
                .
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 text-sm leading-5">
              <input
                type="checkbox"
                checked={acceptedUsage}
                onChange={(event) => setAcceptedUsage(event.target.checked)}
                className="checkbox checkbox-primary  mt-0.5"
              />
              <span>
                Acepto la{" "}
                <Link
                  href="/politica-uso"
                  className="font-bold text-primary underline"
                >
                  Política de uso
                </Link>
                .
              </span>
            </label>

            <button
              type="button"
              disabled={!acceptedPolicies || redirigiendo}
              onClick={loginMicrosoft}
              className="btn btn-primary mt-4 w-full"
            >
              <Image
                src="/images/microsoft.svg"
                alt=""
                width={20}
                height={20}
              />
              {redirigiendo ? "Abriendo Microsoft…" : "Continuar con Microsoft"}
            </button>

            <p role="status" aria-live="polite" className="min-h-5 text-sm text-error">
              {mensaje}
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-ctext/60">
            Solo se permitirán las cuentas autorizadas por la institución.
          </p>
        </div>
      </EntranceAnimation>
    </main>
  );
}
