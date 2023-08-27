import { getAuthSession } from "@/lib/auth";
import db from "@/lib/db";
import { UserSettingsValidator } from "@/lib/validators/user-settings";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name, image } = UserSettingsValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new Response("Username is taken.", { status: 409 });
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
        image: image,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data given.", { status: 422 });
    }

    return new Response(
      "Could not username at this moment, please try again later.",
      {
        status: 500,
      },
    );
  }
}
