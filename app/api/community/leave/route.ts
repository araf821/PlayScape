import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { JoinCommunityValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { communityId } = JoinCommunityValidator.parse(body);

    const memberExists = await db.member.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!memberExists) {
      return new Response("You're already not a part of this community.", {
        status: 400,
      });
    }

    // Check to make sure that the user is not the creator of this community.
    const community = await db.community.findFirst({
      where: {
        id: communityId,
        creatorId: session.user.id,
      },
    });

    if (community) {
      return new Response(
        "You're the creator of this community, you cannot leave.",
        { status: 400 },
      );
    }

    await db.member.delete({
      where: {
        userId_communityId: {
          communityId: communityId,
          userId: session.user.id,
        },
      },
    });

    return new Response(communityId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data given.", { status: 422 });
    }

    return new Response(
      "Could not leave the community at this moment, please try again later.",
      {
        status: 500,
      },
    );
  }
}
