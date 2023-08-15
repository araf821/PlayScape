"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface CreatePageProps {}

const CreatePage: FC<CreatePageProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();

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
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              pi/
            </p>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-7 "
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={() => router.back()} variant="subtle">
            Cancel
          </Button>
          <Button>Create Community</Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
