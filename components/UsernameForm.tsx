"use client";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UsernameFormProps {
  user: Pick<User, "id" | "username">;
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });
  const router = useRouter();

  const { mutate: changeUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name,
      };

      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: `Username already taken.`,
            description: "Please choose a different username.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "There was an error.",
        description:
          "Could not update username at this time, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Username was successfully updated!",
      });
      router.refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((e) => changeUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>Please enter a display name.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              size={32}
              {...register("name")}
              className="w-[400px] pl-6"
            />

            {errors?.name && (
              <p className="break-words px-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change username</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
