import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import UserCommunities from "@/components/UserCommunities";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 gap-y-4 pb-6 md:grid-cols-3 md:gap-x-4">
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* feed sidebar */}
        <div className="order-first mt-4 h-fit overflow-hidden rounded-lg border border-gray-200 shadow-md md:sticky md:top-[8dvh] md:order-last md:mt-0">
          <div className="bg-red-200 px-4 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <HomeIcon className="h-4 w-4 -translate-y-0.5" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-4 py-4 text-sm leading-6 ">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal PlayScape homepage! Check in with your favourite
                communities.
              </p>
            </div>

            {session?.user ? (
              <Suspense fallback={<SkeletonLoader />}>
                <UserCommunities userId={session.user.id} />
              </Suspense>
            ) : null}

            <Link
              href="/community/create"
              className={buttonVariants({ className: "mb-6 mt-4 w-full" })}
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
