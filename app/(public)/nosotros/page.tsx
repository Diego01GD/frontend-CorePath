"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Brain, CodeXml, GitBranch, PencilSparkles, Sigma } from "lucide-react";
import { useEffect, useRef } from "react";

const pillars = [
  { title: "Modelos de Lenguaje", icon: Brain, text: "Procesamiento de lenguaje natural local y eficiente que interactúa de manera inteligente sin depender de grandes servidores externos, garantizando privacidad y rapidez." },
  { title: "Algoritmos Adaptados", icon: Sigma, text: "Algoritmos matemáticos adaptados que alinean tus intereses y habilidades con la especialidad tecnológica idónea para ti de forma transparente." },
  { title: "Diseño Empático", icon: PencilSparkles, text: "Interfaces intuitivas y agradables pensadas por estudiantes para estudiantes, reduciendo la fatiga de los cuestionarios vocacionales tradicionales." },
];

const team = [
  { initials: "DT", focus: "Diseño & Frontend", name: "Diego Alejandro Tzec Ku", role: "Co-Fundador & Diseñador UI/UX", github: "https://github.com/Diego01GD", linkedin: "https://www.linkedin.com/in/diego-tzec-ku-529938259" },
  { initials: "AL", focus: "IA & Backend", name: "Angel Josue Lopez Castilla", role: "Co-Fundador & Ingeniero de IA", github: "https://github.com/DimoltoSs", linkedin: "" },
];

const reveal = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function AboutPage() {
  const compassRef = useRef<HTMLDivElement>(null);
  // Motion values: la aguja se anima sin re-renderizar la página y el resorte se detiene al llegar
  const target = useMotionValue(0);
  const rotate = useSpring(target, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const element = compassRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) >= 400) return;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const current = target.get();
      // Gira por el camino corto en lugar de dar la vuelta completa al cruzar ±180°
      target.set(current + ((((angle - current + 180) % 360) + 360) % 360 - 180));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [target]);

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-16 md:py-20">
      <section className="grid min-h-128 items-center gap-8 md:grid-cols-2 md:gap-16">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-4 font-titulos text-5xl font-bold leading-none md:text-7xl">Sobre Nosotros</h1>
          <p className="mb-5 leading-7 text-ctext/75">Somos estudiantes de la carrera de <strong>Ingeniería en Sistemas Computacionales</strong> del <strong>Instituto Tecnológico de Mérida (ITM)</strong>. Nuestro equipo ha unido fuerzas para desarrollar una plataforma de orientación vocacional inteligente.</p>
          <p className="leading-7 text-ctext/75">Entendemos el dilema digital y la sobrecarga de información al decidir una especialidad. Por ello, combinamos <strong>Modelos de Lenguaje Pequeños (SLM)</strong>, algoritmos de recomendación y un diseño centrado en el usuario para traducir el ruido digital en certidumbre vocacional.</p>
        </motion.div>
        <motion.div className="order-first grid place-items-center md:order-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="grid aspect-square w-full max-w-sm place-items-center rounded-full border border-primary/25 bg-primary/10" ref={compassRef}>
            <svg viewBox="0 0 100 100" className="h-4/5 w-4/5" aria-label="Brújula interactiva">
              <circle cx="50" cy="50" r="45" stroke="var(--primary)" strokeWidth="1.5" fill="none" opacity=".3" />
              <circle cx="50" cy="50" r="41" stroke="var(--primary)" strokeWidth=".5" fill="none" strokeDasharray="3,3" opacity=".15" />
              <text x="50" y="16" fill="var(--primary)" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
              <text x="50" y="91" fill="var(--primary)" fontSize="8" textAnchor="middle" opacity=".4">S</text>
              <text x="87" y="53" fill="var(--primary)" fontSize="8" textAnchor="middle" opacity=".4">E</text>
              <text x="13" y="53" fill="var(--primary)" fontSize="8" textAnchor="middle" opacity=".4">O</text>
              <motion.g style={{ rotate, transformOrigin: "50px 50px", transformBox: "view-box" }}>
                <path d="M50 17 55 50 50 47Z" fill="var(--primary)" /><path d="m50 17-5 33 5-3Z" fill="var(--primary-h)" />
                <path d="m50 83 5-33-5 3Z" fill="var(--primary-h)" /><path d="m50 83-5-33 5 3Z" fill="var(--primary)" />
                <circle cx="50" cy="50" r="3.5" fill="white" /><circle cx="50" cy="50" r="1.2" fill="#1e1e27" />
              </motion.g>
            </svg>
          </div>
        </motion.div>
      </section>
      
      <section className="pt-24">
        <h2 className="mb-8 font-titulos text-3xl font-bold md:text-5xl">Nuestra Propuesta de Valor</h2>
        <motion.div className="grid gap-5 md:grid-cols-3" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ show: { transition: { staggerChildren: 0.15 } } }}>
          {pillars.map(({ title, icon: Icon, text }) => <motion.article className="hover:drop-shadow-lg hover:drop-shadow-primary rounded-2xl border border-bordes-s/35 bg-cards p-7" key={title} variants={reveal}><Icon size={45} className="mb-4 text-primary" aria-hidden="true" /><h3 className="mb-3 text-lg font-bold">{title}</h3><p className="leading-7 text-ctext/70">{text}</p></motion.article>)}
        </motion.div>
      </section>

      <section className="pt-24">
        <h2 className="mb-4 font-titulos text-3xl font-bold md:text-5xl">El Equipo Detrás del Proyecto</h2>
        <p className="mb-8 leading-7 text-ctext/70">Estudiantes de Ingeniería del ITM dedicados a resolver la incertidumbre vocacional en tecnología.</p>
        <motion.div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2" initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.15 } } }}>
          {team.map((member) => <motion.article className="hover:drop-shadow-lg hover:drop-shadow-primary flex flex-col items-center rounded-2xl border border-bordes-s/35 bg-cards p-7 text-center" key={member.initials} variants={reveal}><div className="mb-5 flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-primary/50 bg-primary/10 text-center"><span className="font-titulos text-4xl font-bold text-primary">{member.initials}</span><span className="px-2 text-xs text-ctext/60">{member.focus}</span></div><h3 className="mb-3 text-lg font-bold">{member.name}</h3><span className="mb-2 block text-sm text-primary">{member.role}</span><span className="text-xs text-ctext/60">Sistemas Computacionales ITM</span><div className="mt-6 flex gap-3">{member.github && <a className="transition hover:-translate-y-0.5 hover:text-primary" href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} en GitHub`}><GitBranch /></a>}{member.linkedin && <a className="transition hover:-translate-y-0.5 hover:text-primary" href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} en LinkedIn`}><CodeXml /></a>}</div></motion.article>)}
        </motion.div>
      </section>
    </main>
  );
}
