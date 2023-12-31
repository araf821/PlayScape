import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import JoinLeaveToggle from "@/components/JoinLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      Creator: {
        select: {
          username: true,
        },
      },
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  // Check if there is a membership where the community name matches the slug and the userId
  // matches that of the user currently logged in, to determine if the current user is a
  // member of this community.
  const membership = !session?.user
    ? undefined
    : await db.member.findFirst({
        where: {
          community: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isUserAMember = !!membership;

  if (!community) {
    return notFound();
  }

  // Get the number of members in this community
  const memberCount = await db.member.count({
    where: {
      community: {
        name: slug,
      },
    },
  });

  const postCount = await db.post.count({
    where: {
      communityId: community.id,
    },
  });

  return (
    <div className="mx-auto h-full max-w-7xl sm:container">
      <div className="">
        {/* TODO: back button */}
        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <div className="col-span-2 flex flex-col space-y-6">{children}</div>

          {/* Community info sidebar */}
          <div className="sticky top-[8dvh] order-first hidden h-fit overflow-hidden rounded-lg border border-zinc-700 md:order-last md:block">
            <div className="border-b border-zinc-700 bg-zinc-900 px-6 py-4 font-bold text-zinc-100">
              <p className="font-semibold">About community/{community.name}</p>
            </div>

            <dl className="bg-zinc-900 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-zinc-300">Created</dt>
                <dd className="text-zinc-100">
                  <time dateTime={community.createdAt.toDateString()}>
                    {format(community.createdAt, "MMMM dd, yyyy")}
                  </time>
                </dd>
              </div>

              <hr className="border-zinc-700" />

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-zinc-300">Members</dt>
                <dd className="text-zinc-100">
                  <div className="">{memberCount}</div>
                </dd>
              </div>
              <hr className="border-zinc-700" />

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-zinc-300">Posts</dt>
                <dd className="text-zinc-100">
                  <div className="">{postCount}</div>
                </dd>
              </div>
              <hr className="border-zinc-700" />

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-zinc-300">Creator</dt>
                <dd className="text-zinc-100">
                  <div className="">
                    u/
                    {community.Creator.username ?? (
                      <span className="text-zinc-400">deletedUser</span>
                    )}
                  </div>
                </dd>
              </div>
              <hr className="border-zinc-700" />

              {community.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="font-bold text-zinc-400">
                    You created this community.
                  </p>
                </div>
              ) : null}

              {community.creatorId !== session?.user.id ? (
                <JoinLeaveToggle
                  communityId={community.id}
                  hasJoined={isUserAMember}
                />
              ) : null}

              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "mb-4 w-full",
                })}
                href={`/community/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
