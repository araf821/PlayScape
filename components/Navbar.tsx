import Link from "next/link";
import { FC } from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import { User } from "lucide-react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 z-50 h-16 w-full border-b border-zinc-700 bg-zinc-800 px-4 py-2">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 text-white">
        <a href="/" className="flex items-center gap-2 ">
          <Icons.logo className="h-10 w-10 sm:h-8 sm:w-8" />
          <p className="hidden translate-y-1 font-kalam text-3xl font-bold md:block">
            Play
            <span className="text-sky-400">Scape</span>
          </p>
        </a>

        <SearchBar />

        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Link
            href="/sign-in"
            className="rounded-sm bg-black/10 p-2 transition hover:bg-black/30"
          >
            <User />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
