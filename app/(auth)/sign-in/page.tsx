import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="absolute inset-0">
      <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
      <Link
          href="/"
          className={cn(
            buttonVariants(),
            "-mt-20 self-start hover:bg-zinc-700",
          )}
        >
          Back
        </Link>
        <SignIn />
      </div>
    </div>
  );
};
export default SignInPage;
