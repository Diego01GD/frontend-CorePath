import EntranceAnimation from "../../components/entrance-animation";
import EnlaceRegresar from "../../components/enlace-regresar";

export default function UsagePolicyPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-3xl px-6 py-12">
      <EnlaceRegresar href="/login">Volver</EnlaceRegresar>
      <EntranceAnimation className="mt-8 max-w-none leading-7 text-ctext/80 [&_h1]:font-titulos [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:mt-10 [&_h2]:font-titulos [&_h2]:text-2xl [&_h2]:font-bold [&_p]:my-5">
        <h1 className="font-titulos">Términos y Condiciones de Uso</h1>

        <h2>1. Naturaleza de la herramienta</h2>
        <p>
          El Asistente Vocacional Inteligente es un proyecto académico y
          tecnológico diseñado para ofrecer orientación y sugerencias sobre
          perfiles profesionales. La plataforma utiliza algoritmos de
          Inteligencia Artificial para analizar las respuestas del usuario y
          proporcionar recomendaciones basadas en modelos estandarizados.
        </p>

        <h2>2. Limitación de responsabilidad</h2>
        <p>
          <strong>Importante:</strong> Los resultados, análisis y sugerencias
          emitidos por esta plataforma <strong>no son 100% determinantes,
          concluyentes ni representan una verdad absoluta.</strong> Esta
          herramienta tiene un propósito estrictamente de <em>orientación y
          autodescubrimiento</em>.
        </p>
        <p>
          El uso de esta plataforma no sustituye en ningún momento la
          evaluación, diagnóstico o consejo de un profesional de la psicología
          educativa, pedagogía u orientación vocacional humana certificada. Si
          requiere una opinión profesional definitiva para tomar decisiones
          críticas sobre su futuro académico o laboral, le recomendamos
          contactar a un experto independiente.
        </p>

        <h2>3. Uso de la información</h2>
        <p>
          El usuario se compromete a proporcionar información veraz (nombre,
          matrícula, correo y respuestas honestas en los test) para garantizar
          que el análisis sea lo más acertado posible. El mal uso de la
          plataforma o la introducción de datos falsos derivará en perfiles
          vocacionales inexactos, de los cuales el equipo desarrollador no se
          hace responsable.
        </p>

        <h2>4. Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar esta aplicación, usted reconoce que ha leído,
          comprendido y aceptado el Aviso de Privacidad y los presentes
          Términos de Uso, asumiendo la responsabilidad sobre las decisiones
          que tome a partir de los resultados obtenidos.
        </p>
      </EntranceAnimation>
    </main>
  );
}
