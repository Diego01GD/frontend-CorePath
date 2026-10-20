import Link from "next/link";
import EntranceAnimation from "../../../components/entrance-animation";

export default function LoginSuccessPage() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
      <EntranceAnimation className="w-full max-w-lg rounded-3xl bg-cards p-8 text-center shadow-sm ring-1 ring-bordes-s/20 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
          ✓
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-success">
          Sesión iniciada
        </p>
        <h1 className="mt-3 font-titulos text-4xl font-bold">¡Bienvenido a CorePath!</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-ctext/70">
          Tu cuenta fue identificada correctamente. Ya puedes continuar con
          tu orientación vocacional.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/test" className="btn btn-primary">
            Comenzar test
          </Link>
          <Link href="/chat" className="btn btn-outline border-primary text-primary">
            Ir al chat
          </Link>
        </div>
      </EntranceAnimation>
    </main>
  );
}
