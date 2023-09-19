import CommentSection from "@/components/CommentSection";
import { CommentSectionLoader } from "@/components/Skeletons";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import EditorOutput from "@/components/post/EditorOutput";
import { buttonVariants } from "@/components/ui/Button";
import db from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { wait } from "@/lib/wait";
import { CachedPost } from "@/types/redis";
import { Post, PostVote, User } from "@prisma/client";
import { Frown, Loader2, Smile } from "lucide-react";
import { notFound } from "next/navigation";
import { FC, Suspense } from "react";

interface pageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page: FC<pageProps> = async ({ params }: pageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`,
  )) as CachedPost;

  let post: (Post & { votes: PostVote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) {
    return notFound();
  }

  return (
    <div className="">
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start sm:gap-x-1">
        <Suspense fallback={<PostVoteLoader />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
            className="hidden rounded-md bg-zinc-900 p-1 sm:block"
          />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-zinc-900 p-4 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-sm text-gray-400">
            Posted by u/{post?.author.username ?? cachedPost.authorName}
            {" • "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-zinc-100">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <div className="block sm:hidden">
            <Suspense fallback={<PostVoteLoader />}>
              <PostVoteServer
                postId={post?.id ?? cachedPost.id}
                getData={async () => {
                  return await db.post.findUnique({
                    where: {
                      id: params.postId,
                    },
                    include: {
                      votes: true,
                    },
                  });
                }}
                className="mt-4 flex gap-2 sm:hidden"
              />
            </Suspense>
          </div>

          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            <CommentSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteLoader() {
  return (
    <div className="flex w-20 flex-col items-center pr-6">
      {/* upvote btn */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <Smile className="h-5 w-5 text-zinc-700" />
      </div>

      {/* display of votes */}
      <div className="py-2 text-center text-sm font-medium text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote btn */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <Frown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default page;
