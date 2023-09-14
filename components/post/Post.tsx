"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, PostVote, User } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "../post-vote/PostVoteClient";
import Link from "next/link";

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

  return (
    <div className="rounded-lg border duration-300 border-zinc-700 bg-zinc-900 shadow-md transition hover:bg-zinc-950">
      <div className="flex px-4 py-4 md:px-6">
        <div className="w-full flex-1 sm:w-0">
          <div className="mt-1 flex max-h-80 w-full flex-col text-xs text-zinc-400 sm:flex-row sm:items-center">
            {communityName ? (
              <>
                <Link
                  className="text-sm text-zinc-100 w-fit underline underline-offset-2"
                  href={`/community/${communityName}`}
                >
                  community/{communityName}
                </Link>
                <span className="hidden px-1 sm:block">•</span>
              </>
            ) : null}
            <div className="mt-0.5 sm:mt-0">
              <span>Posted by u/{post.author.username}</span>
              <span className="px-1">•</span>

              {formatTimeToNow(new Date(post.createdAt))}
            </div>
          </div>

          <Link
            className="flex w-fit"
            href={`/community/${communityName}/post/${post.id}`}
          >
            <h1 className="py-2 text-xl font-semibold leading-6 text-white md:text-2xl">
              {post.title}
            </h1>
          </Link>

          <div
            ref={postRef}
            className="relative max-h-80 w-full overflow-clip text-sm"
          >
            <EditorOutput content={post.content} />

            {postRef.current?.clientHeight === 224 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 flex items-center justify-between p-4 text-sm group-hover:bg-zinc-900">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmount={votesAmt}
          className="flex gap-2 sm:w-20 sm:gap-4"
        />

        <Link
          className="flex w-fit items-center gap-2 text-zinc-100"
          href={`/community/${communityName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          {numOfComments} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
