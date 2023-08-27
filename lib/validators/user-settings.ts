import { z } from "zod";

export const UserSettingsValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be 3-21 characters long." })
    .max(21, { message: "Username must be 3-21 characters long." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username can only contain characters a-z, A-Z, 0-9, and underscore.",
    }),
  image: z.string(),
});

export type UserSettingsRequest = z.infer<typeof UserSettingsValidator>;
