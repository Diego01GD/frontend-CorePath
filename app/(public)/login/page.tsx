"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import EntranceAnimation from "../../components/entrance-animation";

export default function LoginPage() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedUsage, setAcceptedUsage] = useState(false);
  const acceptedPolicies = acceptedPrivacy && acceptedUsage;

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
              disabled={!acceptedPolicies}
              className="btn btn-primary mt-4 w-full"
            >
              <Image
                src="/images/microsoft.svg"
                alt="Microsoft"
                width={20}
                height={20}
              />
              Continuar con Microsoft
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-ctext/60">
            Solo se permitirán las cuentas autorizadas por la institución.
          </p>
        </div>
      </EntranceAnimation>
    </main>
  );
}
