import Link from "next/link"
import Logotipo from "./logo"
import Menu from "./menu"

const Header = () => {
  return (
    <header className="w-full bg-cards p-4">
      <div className="max-w-7xl m-auto flex items-center justify-between">
        <Logotipo />
        <div className="flex gap-4 lg:gap-20 items-center flex-row-reverse md:flex-row lg:flex-row">
          <Menu />
          <Link href="/login" className="text-primary font-bold px-5 py-3 border border-primary rounded-2xl hover:bg-primary hover:text-surfaces hover:font-bold">Ingresar</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;