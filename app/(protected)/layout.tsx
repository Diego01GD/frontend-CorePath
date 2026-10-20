import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Logotipo from "../components/logo";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="w-full bg-cards p-4">
        <div className="m-auto flex max-w-7xl items-center justify-between">
          <Logotipo />
          <Link href="/" className="flex items-center gap-1.5 font-bold text-primary hover:text-primary-h">
            <MoveLeft aria-hidden="true" />
            Inicio
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
