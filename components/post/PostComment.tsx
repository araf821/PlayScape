"use client";

import { FC, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "../CommentVotes";
import { Button } from "../ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  postId: string;
  votesAmt: number;
  currentVote: CommentVote | undefined;
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  currentVote,
  postId,
  votesAmt,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState("");

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        "/api/community/post/comment",
        payload,
      );
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description:
          "Comment could not be processed at this time, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

  return (
    <div ref={commentRef} className="flex text-white flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || "unknown user",
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-zinc-100">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-400">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="break-words mt-2 text-sm text-zinc-100">
        {comment.text}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmount={votesAmt}
          initialVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session?.user) return router.push("/sign-in");
            setIsReplying(true);
          }}
          size="xs"
          className="text-zinc-100"
        >
          <MessageSquare className="mr-1.5 h-4 w-4" />
          Reply
        </Button>

        {isReplying ? (
          <div className="ml-2 grid w-full gap-1.5">
            <Label htmlFor="comment">
              Reply to u/{comment.author.username}
            </Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                  className=""
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    if (!input) return;
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                  isLoading={isLoading}
                  disabled={input.length < 3}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
