import PostFeed from "./PostFeed";
import { PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";

const CustomFeed = async ({}) => {
  const session = await getAuthSession();

  const joinedCommunities = await db.member.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      community: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      community: {
        name: {
          in: joinedCommunities.map(({ community }) => community.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
    take: PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
