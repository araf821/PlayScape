import MiniCreatePost from "@/components/post/MiniCreatePost";
import PostFeed from "@/components/post/PostFeed";
import { PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { Flame } from "lucide-react";
import { notFound } from "next/navigation";
import { FC } from "react";

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
    <div>
      <h1 className="flex h-14 items-center gap-2 text-3xl font-semibold md:text-4xl">
        <Flame className="h-8 w-8 md:h-10 md:w-10" /> {community.name}
      </h1>

      <MiniCreatePost session={session} />
      <PostFeed initialPosts={community.posts} communityName={community.name} />
    </div>
  );
};

export default CommunityPage;
