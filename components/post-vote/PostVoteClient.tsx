"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Frown, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmount: number;
  initialVote?: VoteType | null;
  className?: string;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmount,
  initialVote,
  className,
}) => {
  const { loginToast } = useCustomToast();
  const [numOfVotes, setNumOfVotes] = useState<number>(initialVotesAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch("/api/community/post/vote", payload);
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
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === "UP") {
          setNumOfVotes((prev) => prev - 1);
        } else if (type === "DOWN") {
          setNumOfVotes((prev) => prev + 1);
        }
      } else {
        setCurrentVote(type);
        if (type === "UP")
          setNumOfVotes((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setNumOfVotes((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className={cn("", className)}>
      <Button
        disabled={isLoading}
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
        className="group"
      >
        <Smile
          className={cn(
            "h-5 w-5 text-zinc-200 transition group-hover:text-zinc-800",
            {
              "text-emerald-500 group-hover:text-emerald-500":
                currentVote === "UP",
            },
          )}
        />
      </Button>

      <p className="py-2 text-center text-sm font-semibold text-zinc-100">
        {numOfVotes}
      </p>

      <Button
        disabled={isLoading}
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
        className="group"
      >
        <Frown
          className={cn(
            "h-5 w-5 text-zinc-200 transition group-hover:text-zinc-800",
            {
              "text-red-500 group-hover:text-red-500": currentVote === "DOWN",
            },
          )}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
