"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, PostVote, User } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";

type PartialVote = Pick<PostVote, "type">;

interface PostProps {
  communityName: string;
  post: Post & {
    author: User;
    votes: PostVote[];
  };
  numOfComments: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  communityName,
  post,
  numOfComments,
  votesAmt,
  currentVote,
}) => {
  const postRef = useRef<HTMLDivElement>(null);
  console.log(votesAmt);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex justify-between px-6 py-4">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmount={votesAmt}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-gray-500">
            {communityName ? (
              <>
                <a
                  className="text-sm text-zinc-900 underline underline-offset-2"
                  href={`/community/${communityName}`}
                >
                  community/{communityName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>
            <span className="px-1">•</span>

            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/community/${communityName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            ref={postRef}
            className="relative max-h-40 w-full overflow-clip text-sm"
          >
            <EditorOutput content={post.content} />

            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 p-4 text-sm sm:px-6">
        <a
          className="flex w-fit items-center gap-2"
          href={`/community/${communityName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          {numOfComments} comments
        </a>
      </div>
    </div>
  );
};

export default Post;
