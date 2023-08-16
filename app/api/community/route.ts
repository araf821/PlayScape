import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = CommunityValidator.parse(body);

    const communityExists = await db.community.findMany({
      where: {
        name,
      },
    });

    if (communityExists.length) {
      return new Response("Community with this name already exists.", {
        status: 409,
      });
    }

    const community = await db.community.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.member.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    return new Response("Created new community - " + community.name + ".");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create community. Error Message:" + error, {
      status: 500,
    });
  }
}
