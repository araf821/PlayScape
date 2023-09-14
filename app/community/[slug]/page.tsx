import MiniCreatePost from "@/components/post/MiniCreatePost";
import PostFeed from "@/components/post/PostFeed";
import { PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { Flame, Swords } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC, Fragment } from "react";

interface CommunityPageProps {
  params: {
    slug: string;
  };
}

const CommunityPage: FC<CommunityPageProps> = async ({
  params,
}: CommunityPageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: "desc",
        },

        take: PAGINATION_RESULTS,
      },
    },
  });

  if (!community) {
    return notFound();
  }

  return (
    <Fragment>
      <h1 className="flex items-center gap-2.5 text-3xl font-semibold text-zinc-100 md:text-4xl">
        {community.imageUrl ? (
          <div className="relative aspect-square h-12 w-12 rounded-full">
            <Image
              src={community.imageUrl ?? "/community.jpg"}
              alt="community image"
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="relative h-10 w-10 rounded-full border-2 border-zinc-100">
            <Swords className="absolute left-1.5 top-1.5" />
          </div>
        )}
        {community.name}
      </h1>

      <MiniCreatePost session={session} />
      <PostFeed initialPosts={community.posts} communityName={community.name} />
    </Fragment>
  );
};

export default CommunityPage;
