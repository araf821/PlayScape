"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateCommunityPayload } from "@/lib/validators/community";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

interface CreatePageProps {}

const CreatePage: FC<CreatePageProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommunityPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/community", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: `Community already exists.`,
            description: "Please choose a different community name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: `Invalid community name.`,
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description:
          "Could not create a new community, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/community/${data}`);
    },
  });

  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full space-y-6 rounded bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="h-px bg-zinc-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-sm text-zinc-600">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            {/* <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              community/
            </p> */}

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={() => router.back()} variant="subtle">
            Cancel
          </Button>
          <Button
            isLoading
            disabled={input.length < 3}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
