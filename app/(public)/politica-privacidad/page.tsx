import EntranceAnimation from "../../components/entrance-animation";
import EnlaceRegresar from "../../components/enlace-regresar";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-3xl px-6 py-12">
      <EnlaceRegresar href="/login">Volver</EnlaceRegresar>
      <EntranceAnimation className="mt-8 max-w-none leading-7 text-ctext/80 [&_h1]:font-titulos [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:mt-10 [&_h2]:font-titulos [&_h2]:text-2xl [&_h2]:font-bold [&_li]:ml-6 [&_li]:pl-2 [&_ol]:my-5 [&_p]:my-5">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Aviso de privacidad
        </p>
        <h1 className="font-titulos">CorePath - Asistente Vocacional Inteligente</h1>
        <p>
          El equipo de desarrollo del Asistente Vocacional Inteligente (en
          adelante &quot;El Responsable&quot;), hace de su conocimiento que la
          información es tratada de forma estrictamente confidencial. Al
          proporcionar sus datos personales, estos serán utilizados única y
          exclusivamente para los siguientes fines principales:
        </p>
        <ul className="list-">
          <li className="mb-2.5">Generar y gestionar su perfil de evaluación vocacional.</li>
          <li className="mb-2.5">
            Comprobar su identidad y vinculación académica mediante su
            matrícula y correo electrónico.
          </li>
          <li className="mb-2.5">
            Almacenar temporalmente el progreso de sus evaluaciones para
            brindar un seguimiento adecuado.
          </li>
          <li>
            Fines estadísticos e investigación interna para la mejora del
            modelo de orientación.
          </li>
        </ul>

        <h2>Datos personales recabados</h2>
        <p>
          Para llevar a cabo las finalidades descritas en el presente aviso,
          utilizaremos los siguientes datos: Nombre completo, Matrícula
          estudiantil, Correo electrónico y las respuestas proporcionadas
          durante las evaluaciones de intereses y aptitudes (RIASEC).
        </p>

        <h2>Uso de tecnologías de rastreo</h2>
        <p>
          Le informamos que en nuestra plataforma web utilizamos <em>Cookies</em>{" "}
          y <em>almacenamiento local</em>{" "} del navegador. Estas
          tecnologías nos permiten mantener su sesión activa, guardar su
          progreso de forma local para evitar la pérdida de datos ante
          desconexiones y mejorar el rendimiento de la interfaz.
        </p>
        <p>
          Estas tecnologías no extraen información ajena a la plataforma ni
          rastrean su actividad fuera de la misma. Usted puede deshabilitarlas
          desde la configuración de su navegador, aunque esto podría afectar
          el funcionamiento óptimo de la aplicación.
        </p>

        <h2>Derechos ARCO</h2>
        <p>
          En cualquier momento, el titular de los datos podrá hacer uso de sus
          derechos ARCO (Acceso, Rectificación, Cancelación u Oposición) sobre
          el tratamiento de sus datos. Para ejercer estos derechos, puede
          enviar una solicitud al correo electrónico:{" "}
          <strong>[Ingresa aquí tu correo de contacto o el del equipo]</strong>.
        </p>
        <p>
          Si deseas más información, podrás solicitar la versión completa de
          este documento. Se presume que tú consientes tácitamente en el
          tratamiento de tus datos mientras no manifiestes tu oposición. Tus
          datos personales están protegidos.
        </p>
      </EntranceAnimation>
    </main>
  );
}
