import Logotipo from "./logo"
import Menu from "./menu"
import MenuUsuario from "./menu-usuario"

const Header = () => {
  return (
    <header className="w-full bg-cards p-4">
      <div className="max-w-7xl m-auto flex items-center justify-between">
        <Logotipo />
        <div className="flex gap-4 lg:gap-20 items-center flex-row-reverse md:flex-row lg:flex-row">
          <Menu />
          <MenuUsuario />
        </div>
      </div>
    </header>
  );
}

export default Header;