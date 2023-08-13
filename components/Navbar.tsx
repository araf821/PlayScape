import Link from "next/link";
import { FC } from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 h-fit border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 ">
          <Icons.logo className="h-10 w-10 sm:h-8 sm:w-8" />
          <p className="font-pacifico hidden text-2xl font-medium text-zinc-700 md:block">
            PixelLand
          </p>
        </Link>

        {/* Search bar will go here */}

        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
