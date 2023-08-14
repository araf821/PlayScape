import { FC } from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

interface SignUpProps {}

const SignUp: FC<SignUpProps> = ({}) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to [AppName]</h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are agreeing to our User Agreement and Privacy
          Policy.
        </p>

        {/* Sign in form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-600">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 transition duration-200 hover:text-zinc-900"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
