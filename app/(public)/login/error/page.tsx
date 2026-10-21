import Link from "next/link";
import { Suspense } from "react";
import MotivoError from "./motivo-error";
import EntranceAnimation from "../../../components/entrance-animation";

export default function LoginErrorPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
      <EntranceAnimation
        role="alert"
        className="w-full max-w-lg rounded-3xl bg-cards p-8 text-center shadow-sm ring-1 ring-error/25 sm:p-12"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/15 text-3xl font-bold text-error">
          !
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-error">
          Acceso no autorizado
        </p>
        <h1 className="mt-3 font-titulos text-4xl font-bold">
          No pudimos iniciar tu sesión
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-ctext/70">
          <Suspense fallback={null}>
            <MotivoError />
          </Suspense>
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/login" className="btn btn-primary">
            Intentar de nuevo
          </Link>
          <Link href="/" className="btn btn-outline border-primary text-primary">
            Volver al inicio
          </Link>
        </div>
      </EntranceAnimation>
    </main>
  );
}
