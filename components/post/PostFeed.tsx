"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  communityName?: string;
}

const DynamicPost = dynamic(async () => (await import("./Post")).default, {
  ssr: false,
  loading: () => <PostSkeleton />,
});

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetched, isFetchingNextPage } =
    useInfiniteQuery(
      ["infinite-query"],
      async ({ pageParam = 1 }) => {
        const query =
          `/api/posts?limit=${PAGINATION_RESULTS}&page=${pageParam}` +
          (!!communityName ? `&communityName=${communityName}` : "");

        const { data } = await axios.get(query);

        return data as ExtendedPost[];
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1;
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
      },
    );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 mt-4 flex flex-col space-y-6">
      {posts.map((post, index) => {
        const amountOfVotes = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <DynamicPost
                currentVote={currentVote}
                votesAmt={amountOfVotes}
                post={post}
                numOfComments={post.comments.length}
                communityName={post.community.name}
              />
            </li>
          );
        }

        return (
          <DynamicPost
            currentVote={currentVote}
            votesAmt={amountOfVotes}
            key={post.id}
            post={post}
            numOfComments={post.comments.length}
            communityName={post.community.name}
          />
        );
      })}

      {/* {isFetchingNextPage ? (
        <div>
          <Loader2 className="mx-auto animate-spin" size={60} />
        </div>
      ) : posts.length > 0 ? (
        <p className="py-16 text-center">
          You&rsquo;ve reached the end of the feed. Please touch grass.
        </p>
      ) : isFetched && posts.length === 0 ? (
        <p className="py-16 text-center">
          No posts to display.
        </p>
      ) : (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )} */}
    </ul>
  );
};

export default PostFeed;

export const PostSkeleton = () => {
  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="flex animate-pulse flex-col gap-2 px-6 py-4">
        <div className="h-4 w-20 rounded-lg bg-neutral-300 md:w-40" />
        <div className="h-8 w-40 rounded-lg bg-neutral-300 md:w-full" />
        <div className="h-60 w-full rounded-lg bg-neutral-300" />
        <div className="flex justify-between">
          <div className="h-6 w-32 rounded-lg bg-neutral-300" />
          <div className="h-6 w-32 rounded-lg bg-neutral-300" />
        </div>
      </div>
    </div>
  );
};
