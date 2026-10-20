"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqData = [
  ["¿Qué es exactamente esta plataforma?", "Es un asistente virtual vocacional interactivo que funciona mediante un Modelo de Lenguaje Pequeño (SLM) y una arquitectura de Generación Aumentada por Recuperación (RAG) para ofrecerte orientación académica estructurada."],
  ["¿Para quién está diseñada esta herramienta?", "El sistema está diseñado y delimitado exclusivamente para los estudiantes de Ingeniería en Sistemas Computacionales del Instituto Tecnológico de Mérida que están en proceso de elegir su módulo de especialidad."],
  ["¿Cómo genera el sistema las recomendaciones?", "Mediante un cuestionario interactivo y un módulo conversacional, la inteligencia artificial evalúa tu perfil basándose en modelos psicométricos como RIASEC y estándares del mercado laboral tecnológico como NICE y EDISON. Al finalizar, calcula la similitud semántica y presenta las tres especialidades más afines."],
  ["¿Cuál es la función del avatar en la pantalla?", "Es un Agente Pedagógico Animado diseñado bajo principios de Interacción Humano-Computadora. Su propósito es reducir la fatiga visual y la carga cognitiva al consumir información técnica."],
] as const;

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 font-titulos text-5xl font-bold leading-none md:text-7xl">Preguntas Frecuentes</h1>
        <p className="leading-7 text-ctext/70">Encuentra respuestas sobre el funcionamiento, la metodología y la tecnología detrás de la plataforma.</p>
      </header>
      <div className="grid gap-4">
        {faqData.map(([question, answer], index) => {
          const isOpen = activeIndex === index;
          return (
            <div key={question} className={`overflow-hidden rounded-2xl border bg-cards transition-all duration-200 ${isOpen ? "border-primary shadow-lg shadow-primary/10" : "border-bordes-s/40"}`}>
              <button
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold transition-colors hover:text-primary md:p-6"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setActiveIndex(isOpen ? null : index)}
              >
                <span>{question}</span>
                <svg className={`w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`faq-answer-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} role="region">
                    <div className="px-5 pb-6 leading-7 text-ctext/75 md:px-6"><p>{answer}</p></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </main>
  );
}
