"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import EntranceAnimation from "../../components/entrance-animation";
import { correoPermitido, DOMINIO_PRINCIPAL } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const redirectTo = () => `${window.location.origin}/auth/callback`;
// Se activa con NEXT_PUBLIC_LOGIN_MICROSOFT=true cuando el proveedor Azure esté configurado en Supabase
const MICROSOFT_ACTIVO = process.env.NEXT_PUBLIC_LOGIN_MICROSOFT === "true";

export default function LoginPage() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedUsage, setAcceptedUsage] = useState(false);
  const acceptedPolicies = acceptedPrivacy && acceptedUsage;
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "error">("idle");
  const [mensaje, setMensaje] = useState("");

  const loginMicrosoft = async () => {
    setMensaje("");
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "azure",
      options: { scopes: "email", redirectTo: redirectTo() },
    });
    if (error) setMensaje("El inicio de sesión con Microsoft aún no está disponible. Usa el enlace por correo.");
  };

  // shortcut: acceso temporal por enlace al correo mientras TI autoriza la app de Microsoft; quitar este formulario después
  const enviarEnlace = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!correoPermitido(email)) {
      setEstado("error");
      setMensaje(`Usa tu correo institucional @${DOMINIO_PRINCIPAL}.`);
      return;
    }
    setEstado("enviando");
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo() },
    });
    setEstado(error ? "error" : "enviado");
    setMensaje(error ? "No se pudo enviar el enlace. Intenta de nuevo en unos minutos." : "Revisa tu correo y abre el enlace en este mismo navegador.");
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
              disabled={!acceptedPolicies || !MICROSOFT_ACTIVO}
              onClick={loginMicrosoft}
              className="btn btn-primary mt-4 w-full"
            >
              <Image
                src="/images/microsoft.svg"
                alt="Microsoft"
                width={20}
                height={20}
              />
              {MICROSOFT_ACTIVO ? "Continuar con Microsoft" : "Microsoft (próximamente)"}
            </button>

            <form onSubmit={enviarEnlace} className="space-y-3 border-t border-bordes-s/20 pt-4">
              <label htmlFor="correo" className="block text-sm font-bold">
                O recibe un enlace de acceso en tu correo
              </label>
              <input
                id="correo"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={`usuario@${DOMINIO_PRINCIPAL}`}
                className="input input-bordered w-full bg-background"
              />
              <button
                type="submit"
                disabled={!acceptedPolicies || estado === "enviando"}
                className="btn btn-outline w-full border-primary text-primary hover:bg-primary hover:text-surfaces"
              >
                {estado === "enviando" ? "Enviando…" : "Enviarme el enlace"}
              </button>
            </form>

            <p role="status" aria-live="polite" className={`min-h-5 text-sm ${estado === "error" ? "text-error" : "text-success"}`}>
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
