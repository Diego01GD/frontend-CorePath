import Image from "next/image"
import Link from "next/link"

const Logotipo = () => {
  return (
    <Link href="/" className="min-w-0">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <Image
            src="/images/Logo_Tec.svg"
            width={70}
            height={70}
            alt="Instituto Tecnologico de Merida"
            loading="eager"
            className="h-12 w-12 shrink-0 md:h-17.5 md:w-17.5"
          />
  
          <div className="flex min-w-0 flex-col font-textos text-sm leading-tight font-semibold flex-wrap md:gap-1 md:text-xl md:flex-row">
            <p>CorePath:</p> 
            <p>Asistente vocacional</p>
          </div>
      </div>
    </Link>
  );
}

export default Logotipo;