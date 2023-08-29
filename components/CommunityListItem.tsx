import { FC } from "react";
import { buttonVariants } from "./ui/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CommunityListItemProps {
  communityName: string;
}

const CommunityListItem: FC<CommunityListItemProps> = ({ communityName }) => {
  return (
    <Link
      className={buttonVariants({
        variant: "subtle",
        className: "flex justify-between",
      })}
      href={`/community/${communityName}`}
    >
      {communityName}
      <ArrowRight />
    </Link>
  );
};

export default CommunityListItem;
