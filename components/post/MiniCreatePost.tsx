"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "../UserAvatar";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="list-none overflow-hidden rounded-md bg-zinc-900 shadow ">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathname + "/submit")}
          placeholder="Create post"
          className="border-zinc-700 bg-zinc-800 outline-zinc-700 focus:ring-zinc-700"
        />

        <div className="flex">
          <Button
            className="hidden text-zinc-300 hover:text-zinc-800 sm:block"
            variant="ghost"
            onClick={() => router.push(pathname + "/submit")}
          >
            <ImageIcon />
          </Button>
          <Button
            className="hidden text-zinc-300 hover:text-zinc-800 md:block"
            variant="ghost"
            onClick={() => router.push(pathname + "/submit")}
          >
            <Link2 />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default MiniCreatePost;
