"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { FC, useState } from "react";
import { Frown, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CommentVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/Button";

interface CommentVotesProps {
  commentId: string;
  initialVotesAmount: number;
  initialVote?: Pick<CommentVote, "type">;
}

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmount,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [numOfVotes, setNumOfVotes] = useState<number>(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      await axios.patch("/api/community/post/comment/vote", payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setNumOfVotes((prev) => prev - 1);
      else setNumOfVotes((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }

        return toast({
          title: "Something went wrong.",
          description: "Could not register your vote at this time.",
          variant: "destructive",
        });
      }
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") {
          setNumOfVotes((prev) => prev - 1);
        } else if (type === "DOWN") {
          setNumOfVotes((prev) => prev + 1);
        }
      } else {
        setCurrentVote({ type });
        if (type === "UP")
          setNumOfVotes((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setNumOfVotes((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        disabled={isLoading}
        onClick={() => vote("UP")}
        size="sm"
        aria-label="upvote"
      >
        <Smile
          className={cn("h-5 w-5 text-zinc-200", {
            "text-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-semibold text-zinc-100">
        {numOfVotes}
      </p>

      <Button
        disabled={isLoading}
        onClick={() => vote("DOWN")}
        size="sm"
        aria-label="upvote"
      >
        <Frown
          className={cn("h-5 w-5 text-zinc-200", {
            "text-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
