"use client";

import { FC } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { JoinCommunityPayload } from "@/lib/validators/community";
import axios from "axios";

interface JoinLeaveToggleProps {
  communityId: string;
}

const JoinLeaveToggle: FC<JoinLeaveToggleProps> = ({ communityId }) => {
  const isSubscribed = true;

  const {} = useMutation({
    mutationFn: async () => {
      const payload: JoinCommunityPayload = {
        communityId: communityId,
      };

      const { data } = await axios.post("/api/community/join", payload);
      return data as string;
    },
  });

  return isSubscribed ? (
    <Button className="mb-4 mt-1 w-full">Leave community</Button>
  ) : (
    <Button className="mb-4 mt-1 w-full">Join to post</Button>
  );
};

export default JoinLeaveToggle;
