"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { JoinCommunityPayload } from "@/lib/validators/community";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface JoinLeaveToggleProps {
  communityId: string;
  hasJoined: boolean;
}

const JoinLeaveToggle: FC<JoinLeaveToggleProps> = ({
  communityId,
  hasJoined,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: join, isLoading: isJoining } = useMutation({
    mutationFn: async () => {
      const payload: JoinCommunityPayload = {
        communityId: communityId,
      };

      const { data } = await axios.post("/api/community/join", payload);
      return data as string;
    },
    onError: (err: any) => {
      if (err?.response?.status === 401) {
        return loginToast();
      }

      return toast({
        title: "There was an error.",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Successful!",
        description: "You are now a member of this community!",
        variant: "default",
      });
    },
  });

  const { mutate: leave, isLoading: isLeaving } = useMutation({
    mutationFn: async () => {
      const payload: JoinCommunityPayload = {
        communityId: communityId,
      };

      const { data } = await axios.post("/api/community/leave", payload);
      return data as string;
    },
    onError: (err: any) => {
      if (err?.response?.status === 401) {
        return loginToast();
      }

      console.log(err);

      return toast({
        title: "There was an error.",
        description: "Something went wrong, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Successful!",
        description: "You are no longer a member of this community!",
        variant: "default",
      });
    },
  });

  return hasJoined ? (
    <Button
      onClick={() => leave()}
      isLoading={isLeaving}
      className="mb-4 mt-1 w-full"
    >
      Leave community
    </Button>
  ) : (
    <Button
      onClick={() => join()}
      isLoading={isJoining}
      className="my-4 w-full"
    >
      Join to post
    </Button>
  );
};

export default JoinLeaveToggle;
