import { FC, Suspense } from "react";
import UserCommunities from "./UserCommunities";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";

interface FeedSidebarProps {}

const FeedSidebar: FC<FeedSidebarProps> = async ({}) => {
  const session = await getAuthSession();

  return (
    <div className="z-10 h-fit mt-4 md:col-span-2 overflow-hidden rounded-lg border border-zinc-700 md:sticky md:top-20 md:mt-14">
      <div className="bg-zinc-900 p-4">
        <p className="flex items-center gap-1.5 py-3 font-semibold text-zinc-100">
          <HomeIcon className="h-4 w-4 -translate-y-0.5" />
          Home
        </p>
      </div>

      <div className="space-y-4 border-t border-zinc-800 bg-zinc-900 p-4 text-sm leading-6 ">
        <div className="flex justify-between gap-x-4 py-3">
          <p className="text-zinc-300">
            Your personal PlayScape homepage! Check in with your favourite
            communities.
          </p>
        </div>

        {session?.user ? (
          <Suspense fallback={<SkeletonLoader />}>
            <UserCommunities userId={session.user.id} />
          </Suspense>
        ) : null}

        <hr className="border-zinc-700" />

        <Link
          href="/community/create"
          className={buttonVariants({
            variant: "default",
            className: "my-4 w-full bg-zinc-950 hover:bg-zinc-800",
          })}
        >
          Create Community
        </Link>
      </div>
    </div>
  );
};

export default FeedSidebar;


const SkeletonLoader = () => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="h-6 w-40 animate-pulse rounded-lg bg-neutral-300" />
        <div className="h-12 w-full animate-pulse rounded-lg bg-neutral-300" />
        <div className="h-12 w-full animate-pulse rounded-lg bg-neutral-300" />
      </div>
    );
  };