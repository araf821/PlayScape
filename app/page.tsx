import UserCommunities from "@/components/UserCommunities";
import CustomFeed from "@/components/post/CustomFeed";
import GeneralFeed from "@/components/post/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="text-3xl font-bold text-zinc-100 md:text-4xl">
        Your feed
      </h1>
      <div className="grid grid-cols-1 gap-y-4 pb-6 md:grid-cols-3 md:gap-x-4">
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* feed sidebar */}
        <div className="order-first mt-4 h-fit overflow-hidden rounded-lg border border-zinc-700 md:sticky md:top-[15dvh] md:order-last md:mt-0">
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
                variant: "outline",
                className: "my-4 w-full",
              })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="h-6 w-40 animate-pulse rounded-lg bg-neutral-300" />
      <div className="h-12 w-full animate-pulse rounded-lg bg-neutral-300" />
      <div className="h-12 w-full animate-pulse rounded-lg bg-neutral-300" />
    </div>
  );
};
