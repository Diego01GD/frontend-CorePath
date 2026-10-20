"use client";

import Link from "next/link";
import { useState } from "react";
import EntranceAnimation from "../../components/entrance-animation";

const questions = [
  "¿Qué actividades disfrutas cuando tienes que resolver un problema?",
  "¿Qué te gustaría construir o mejorar con la tecnología?",
  "¿Cómo prefieres aprender algo nuevo?",
];

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [completed, setCompleted] = useState(false);

  const isLastQuestion = currentQuestion === questions.length - 1;

  if (completed) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center px-6 py-12">
        <EntranceAnimation className="w-full rounded-3xl bg-cards p-8 text-center shadow-sm ring-1 ring-bordes-s/20 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
            ✓
          </div>
          <h1 className="mt-6 font-titulos text-4xl font-bold">Test completado</h1>
          <p className="mx-auto mt-4 max-w-md leading-7 text-ctext/70">
            Ya tenemos tus respuestas. Conversa con A.N.A. para profundizar
            en las áreas que más se relacionan contigo.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/chat" className="btn btn-primary">
              Conversar con A.N.A.
            </Link>
            <Link href="/" className="btn btn-outline border-primary text-primary">
              Volver al inicio
            </Link>
          </div>
        </EntranceAnimation>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center px-6 py-12">
      <EntranceAnimation className="w-full rounded-3xl bg-cards p-8 shadow-sm ring-1 ring-bordes-s/20 sm:p-12">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Test vocacional
          </p>
          <span className="text-sm text-ctext/60">
            {currentQuestion + 1} de {questions.length}
          </span>
        </div>
        <progress
          className="progress progress-primary mt-5 w-full"
          value={currentQuestion + 1}
          max={questions.length}
          aria-label={`Pregunta ${currentQuestion + 1} de ${questions.length}`}
        />
        <h1 className="mt-10 font-titulos text-3xl font-bold leading-tight sm:text-4xl">
          {questions[currentQuestion]}
        </h1>
        <div className="mt-8 grid gap-3">
          {["Me gusta investigar y analizar", "Prefiero crear y experimentar", "Disfruto ayudar y comunicar"].map(
            (answer) => (
              <button
                key={answer}
                type="button"
                onClick={() => setSelectedAnswer(answer)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  selectedAnswer === answer
                    ? "border-primary bg-primary-l font-bold"
                    : "border-bordes-s/30 hover:border-primary"
                }`}
              >
                {answer}
              </button>
            ),
          )}
        </div>
        <div className="mt-10 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Link href="/chat" className="btn btn-ghost">
            Hablar con A.N.A.
          </Link>
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={() => {
              if (!isLastQuestion) {
                setCurrentQuestion((current) => current + 1);
                setSelectedAnswer("");
              } else {
                setCompleted(true);
              }
            }}
            className="btn btn-primary"
          >
            {isLastQuestion ? "Ver orientación" : "Siguiente"}
          </button>
        </div>
      </EntranceAnimation>
    </main>
  );
}
