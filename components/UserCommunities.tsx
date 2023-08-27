import { FC } from "react";
import CommunityListItem from "./CommunityListItem";
import db from "@/lib/db";

interface UserCommunitiesProps {
  userId: string | null;
}

const UserCommunities: FC<UserCommunitiesProps> = async ({ userId }) => {
  if (!userId) return null;

  const communities = await db.community.findMany({
    where: {
      members: {
        every: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      creatorId: true,
    },
  });

  const createdCommunities = communities.filter((c) => c.creatorId === userId);
  const joinedCommunities = communities.filter((c) => c.creatorId !== userId);

  if (!communities) {
    return (
      <div className="py-2 text-zinc-500">
        Looks like you have not created or joined any communities.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {createdCommunities.length ? (
        <div>
          <p className="">Communities you&rsquo;ve created</p>
          <hr className="border-zinc-200" />
          <div className="mt-2 flex flex-col gap-2">
            {createdCommunities.map((community) => (
              <CommunityListItem
                key={community.id}
                communityName={community.name}
              />
            ))}
          </div>
        </div>
      ) : null}

      {joinedCommunities.length ? (
        <div>
          <p className="">Communities you&rsquo;ve joined</p>
          <hr className="border-zinc-200" />
          <div className="mt-2 flex flex-col gap-2">
            {joinedCommunities.map((community) => (
              <CommunityListItem
                key={community.id}
                communityName={community.name}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserCommunities;
