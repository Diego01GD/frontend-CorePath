"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import EntranceAnimation from "../../components/entrance-animation";

type Message = {
  id: number;
  text: string;
  fromUser?: boolean;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hola, soy A.N.A. Puedo ayudarte a explorar tus intereses y resolver dudas sobre las especialidades tecnológicas.",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), text, fromUser: true },
    ]);
    setDraft("");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col px-6 py-10">
      <EntranceAnimation className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">A.N.A.</p>
          <h1 className="mt-2 font-titulos text-4xl font-bold">Tu espacio de orientación</h1>
          <p className="mt-3 text-ctext/70">
            Conversa sobre tus intereses y descubre nuevas posibilidades.
          </p>
        </div>
        <Link href="/test" className="btn btn-outline border-primary text-primary">
          Hacer el test
        </Link>
      </EntranceAnimation>

      <EntranceAnimation delay={0.12} className="flex min-h-[32rem] flex-1 flex-col overflow-hidden rounded-3xl bg-cards shadow-sm ring-1 ring-bordes-s/20">
        <div className="flex items-center gap-3 border-b border-bordes-s/20 px-6 py-4">
          <span className="h-3 w-3 rounded-full bg-success" aria-hidden="true" />
          <span className="font-bold">A.N.A. está lista para ayudarte</span>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.fromUser ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.fromUser
                    ? "rounded-br-sm bg-primary text-surfaces"
                    : "rounded-bl-sm bg-primary-l text-ctext"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-3 border-t border-bordes-s/20 p-4">
          <label htmlFor="chat-message" className="sr-only">
            Escribe tu mensaje
          </label>
          <input
            id="chat-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escribe una pregunta..."
            className="input input-bordered min-w-0 flex-1 bg-background"
          />
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </EntranceAnimation>
    </main>
  );
}
