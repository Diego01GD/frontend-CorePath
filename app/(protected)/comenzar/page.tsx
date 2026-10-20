import Link from "next/link";
import Image from "next/image";
import { ArrowRight, List, MessageCircle } from "lucide-react";
import EntranceAnimation from "../../components/entrance-animation";

const pasos = ["Responde", "Recibe tu recomendación", "Consulta a Kiara"];
const temas = ["Ciberseguridad", "Desarrollo Web y Móvil", "Inteligencia Artificial", "Redes"];

export default function ComenzarPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 lg:py-12">
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <EntranceAnimation className="flex flex-col items-center text-center">
          <Image
            src="/images/Lobo_Tec_SF.png"
            alt="Kiara, la orientadora vocacional"
            width={1029}
            height={1542}
            priority
            className="h-auto w-40 sm:w-52 lg:w-64"
          />
          <p className="mt-6 font-titulos text-xl font-bold text-accent">Kiara</p>
          <p className="text-sm text-ctext/70">Tu orientadora vocacional</p>
        </EntranceAnimation>

        <div>
          <EntranceAnimation delay={0.08}>
            <h1 className="font-titulos text-4xl font-bold sm:text-5xl">¿Por dónde empiezas?</h1>
            <p className="mt-3 text-ctext/70">Elige la opción que mejor se adapte a ti ahora mismo.</p>
          </EntranceAnimation>

          <EntranceAnimation delay={0.16} className="mt-8 rounded-3xl bg-cards p-6 shadow-sm ring-1 ring-bordes-s/20 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <List aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-titulos text-xl font-bold">Test vocacional</h2>
                <p className="flex items-center gap-1.5 text-xs text-ctext/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                  En solo 10 min · Basado en RIASEC
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-ctext/80">
              Responde preguntas sobre tus intereses y actividades preferidas. Al terminar
              recibirás una recomendación de especialidad y tu perfil de intereses.
            </p>
            <ol className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ctext/70">
              {pasos.map((paso, i) => (
                <li key={paso} className="flex items-center gap-3">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 font-titulos text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {paso}
                  </span>
                  {i < pasos.length - 1 && <ArrowRight size={16} className="hidden sm:block" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <Link href="/test" className="btn btn-primary mt-5">
              Comenzar el test
            </Link>
          </EntranceAnimation>

          <EntranceAnimation delay={0.24} className="mt-6 rounded-3xl bg-cards p-6 shadow-sm ring-1 ring-bordes-s/20 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <MessageCircle aria-hidden="true" />
              </span>
              <h2 className="font-titulos text-xl font-bold">Chatea con Kiara</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-ctext/80">
              ¿Tienes dudas sobre una especialidad, las materias o el campo laboral? Kiara
              responde tus preguntas en cualquier momento.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Temas">
              {temas.map((tema) => (
                <li key={tema} className="rounded-full border border-bordes-s/40 bg-primary/10 px-2.5 py-0.5 text-xs">
                  {tema}
                </li>
              ))}
            </ul>
            <Link href="/chat" className="btn btn-outline mt-5 border-primary text-primary hover:bg-primary hover:text-surfaces">
              Abrir chat
            </Link>
          </EntranceAnimation>
        </div>
      </div>

      <footer className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-ctext/70 lg:ml-[40%]">
        <a href="https://www.merida.tecnm.mx" target="_blank" rel="noreferrer" className="hover:text-primary">Sitio Institucional</a>
        <Link href="/politica-privacidad" className="hover:text-primary">Aviso de Privacidad</Link>
        <Link href="/politica-uso" className="hover:text-primary">Términos y Condiciones de Uso</Link>
      </footer>
    </main>
  );
}
