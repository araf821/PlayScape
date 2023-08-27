"use client";

import {
  UserSettingsRequest,
  UserSettingsValidator,
} from "@/lib/validators/user-settings";
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
import Image from "next/image";

interface UsernameFormProps {
  user: Pick<User, "id" | "username" | "image">;
}

const UsernameForm: FC<UsernameFormProps> = ({ user }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSettingsRequest>({
    resolver: zodResolver(UserSettingsValidator),
    defaultValues: {
      name: user?.username || "",
      image: user?.image || "",
    },
  });
  const router = useRouter();

  const { mutate: changeUsername, isLoading } = useMutation({
    mutationFn: async ({ name, image }: UserSettingsRequest) => {
      const payload: UserSettingsRequest = {
        name,
        image,
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
    <form
      className="shadow-sm"
      onSubmit={handleSubmit((e) => changeUsername(e))}
    >
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Change your profile picture or username.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 md:px-6">
          <div className="relative mb-6 h-40 w-40 overflow-hidden rounded-lg">
            <Image
              src={user.image ?? ""}
              alt="bebi"
              fill
              className="object-cover"
            />
          </div>

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
              className="w-full max-w-[400px] pl-6 shadow"
            />

            {errors?.name && (
              <p className="break-words px-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="space-x-2 px-4 md:px-6">
          <Button type="button" variant="subtle" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Confirm changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
