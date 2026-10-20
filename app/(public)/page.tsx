"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Conoce tus intereses",
    description: "Responde un cuestionario breve sobre tus habilidades, preferencias y forma de resolver problemas.",
  },
  {
    number: "02",
    title: "Conversa con A.N.A",
    description: "Aclara tus dudas con nuestra orientadora virtual y descubre qué áreas despiertan más tu curiosidad.",
  },
  {
    number: "03",
    title: "Recibe tu orientación",
    description: "Obtén un informe con las especialidades que mejor coinciden con tu perfil y explora tus siguientes pasos.",
  },
];

const entrance = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div>
      <main className="mx-auto mt-6 max-w-7xl p-7 lg:p-0">
        <section className="flex flex-col-reverse items-center lg:flex-row">
          <motion.div
            className="flex w-full flex-col justify-between py-8 lg:h-[calc(100dvh-136px)] lg:w-1/2"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
          >
            <motion.h1 variants={entrance} className="font-titulos text-4xl font-bold lg:text-6xl">
              Tu futuro no debe de ser al azar
            </motion.h1>
            <motion.h3 variants={entrance} className="mt-4">
              Descubre qué especialidad de Ingeniería en Sistemas va contigo y
              resuelve tus dudas con A.N.A, tu orientadora virtual.
            </motion.h3>
            <motion.div variants={entrance} className="mt-5 flex flex-col items-center gap-6 lg:mt-0 lg:flex-row lg:gap-12">
              <Link href="/login" className="inline-block rounded-xl bg-primary w-full lg:w-auto text-center px-5 py-3.5 font-bold hover:bg-primary-h text-surfaces">
                Comenzar el test
              </Link>
              <Link href="/login" className="inline-block font-semibold hover:text-lg py-3.5 ">
                Chatea con A.N.A
              </Link>
            </motion.div>

            <motion.div variants={entrance} className="flex flex-wrap items-center justify-center gap-7 lg:justify-items-start">
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-4xl bg-success" /><p>En solo 10 min.</p></div>
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-4xl bg-success" /><p>Puedes pausar</p></div>
              <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-4xl bg-success" /><p>Basado en RIASEC</p></div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex w-1/2 flex-col items-center justify-center"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <figure className="flex w-full items-center justify-center">
              <Image src="/images/Lobo_Tec_SF.png" width={300} height={300} alt="Agente Pedagogico A.N.A" />
            </figure>
            <p className="rounded-2xl bg-cards px-20 py-5 text-3xl font-bold">A.N.A</p>
          </motion.div>
        </section>

        <section className="py-24">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={entrance}
          >
            <h2 className="font-titulos text-3xl font-bold md:text-5xl">Tu camino empieza aquí</h2>
            <p className="mt-4 leading-7 text-ctext/70">
              Completa estos tres pasos para conocer mejor tus opciones y tomar
              una decisión con mayor confianza.
            </p>
          </motion.div>
          <motion.div
            className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {steps.map((step) => (
              <motion.article
                key={step.number}
                variants={entrance}
                className="rounded-2xl border border-bordes-s/35 bg-cards p-7 text-center"
              >
                <span className="font-titulos text-4xl font-bold text-primary">{step.number}</span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-ctext/70">{step.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
