import Link from "next/link";
import { FC } from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const session = await getAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 z-10 h-fit border-b border-zinc-700 bg-zinc-800 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2 text-background">
        <Link href="/" className="flex items-center gap-2 ">
          <Icons.logo className="h-10 w-10 sm:h-8 sm:w-8" />
          <p className="hidden translate-y-1 font-kalam text-2xl font-bold md:block">
            Play
            <span className="text-accent">Scape</span>
          </p>
        </Link>

        <SearchBar />

        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
