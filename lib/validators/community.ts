import { z } from "zod";

export const CommunityValidator = z.object({
  name: z.string().min(3).max(21),
});

export const JoinCommunityValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type JoinCommunityPayload = z.infer<typeof JoinCommunityValidator>;
