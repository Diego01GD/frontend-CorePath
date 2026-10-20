import Link from "next/link";
import TV from "./components/tv-notfound";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">

      <h1 className="max-w-md text-4xl font-bold font-titulos text-primary-h">
      La página que buscas no existe o fue movida.
      </h1>

      <TV />

      <Link
        href="/"
        className="btn bg-primary text-surfaces hover:bg-primary-h mt-2"
      >
        Volver al inicio
      </Link>

    </main>
  );
}