import { z } from "zod";

export const UsernameValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be 3-21 characters long." })
    .max(21, { message: "Username must be 3-21 characters long." })
    .regex(/^[a-zA-Z0-9_]+$/),
});

export type UsernameRequest = z.infer<typeof UsernameValidator>;
