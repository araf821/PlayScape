"use client";

import { FC } from "react";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="h-6 w-6 rounded-md p-0"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="text-zinc-100 transition hover:text-zinc-900" />
    </Button>
  );
};

export default CloseModal;
