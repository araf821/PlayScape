import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let joinedCommunityIds: string[] = [];

  if (session) {
    const communitiesJoined = await db.member.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
    });

    joinedCommunityIds = communitiesJoined.map(({ community }) => community.id);
  }

  try {
    const { limit, page, communityName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        communityName: z.string().nullish().optional(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereQuery = {};

    if (communityName) {
      whereQuery = {
        community: {
          name: communityName,
        },
      };
    } else if (session) {
      whereQuery = {
        community: {
          id: {
            in: joinedCommunityIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereQuery,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response("Invalid request data given.", { status: 422 });
    }

    return new Response("Could not fetch more posts, please try again later.", {
      status: 500,
    });
  }
}
