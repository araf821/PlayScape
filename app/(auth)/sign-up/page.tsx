import SignUp from "@/components/SignUp";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "subtle" }),
            "-mt-20 self-start",
          )}
        >
          Back
        </Link>
        <SignUp />
      </div>
    </div>
  );
};
export default SignUpPage;
