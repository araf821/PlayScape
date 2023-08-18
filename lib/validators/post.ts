import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be longer than 3 characters." })
    .max(128, { message: "Message is too long." }),
  communityId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
