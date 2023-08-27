import { getAuthSession } from "@/lib/auth";
import { Post, PostVote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import { FC } from "react";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmount?: number;
  initialVoteType?: VoteType;
  getData?: () => Promise<(Post & { votes: PostVote[] }) | null>;
  className?: string;
}

const PostVoteServer: FC<PostVoteServerProps> = async ({
  postId,
  initialVoteType,
  initialVotesAmount,
  getData,
  className
}) => {
  const session = await getAuthSession();

  let _numOfVotes: number = 0;
  let _currentVoteType: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) {
      return notFound();
    }

    _numOfVotes = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVoteType = post.votes.find(
      (vote) => vote.userId === session?.user.id,
    )?.type;
  } else {
    _numOfVotes = initialVotesAmount!;
    _currentVoteType = initialVoteType;
  }

  return (
    <PostVoteClient
      initialVotesAmount={_numOfVotes}
      initialVote={_currentVoteType}
      postId={postId}
      className={className}
    />
  );
};

export default PostVoteServer;
