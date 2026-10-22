import Image from "next/image"
import Link from "next/link"

const Logotipo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-4">
        <Image
            src="/images/Logo_Tec.svg"
            width={70}
            height={70}
            alt="Instituto Tecnologico de Merida"
            loading="eager"
            className="h-17.5 w-17.5"
          />
  
          <div className=" flex flex-col gap-1 font-textos font-semibold text-base flex-wrap md:text-xl md:flex-row">
            <p>CorePath:</p> 
            <p>Asistente vocacional</p>
          </div>
      </div>
    </Link>
  );
}

export default Logotipo;