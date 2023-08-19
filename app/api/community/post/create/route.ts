import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { JoinCommunityValidator } from "@/lib/validators/community";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { communityId, title, content } = PostValidator.parse(body);

    const memberExists = await db.member.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!memberExists) {
      return new Response(
        "You must be a member of this community to post here.",
        {
          status: 400,
        },
      );
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
      },
    });

    return new Response(communityId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data given.", { status: 422 });
    }

    return new Response(
      "Post could not be published at this time, please try again later.",
      {
        status: 500,
      },
    );
  }
}
