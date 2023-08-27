import UsernameForm from "@/components/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FC } from "react";

export const metadata = {
  title: "Settings",
  description: "Manage account and site preferences.",
};

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn ?? "/sign-in");
  }

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">Settings</h1>
      <UsernameForm
        user={{
          id: session.user.id,
          username: session.user.username || "",
          image: session.user.image || "",
        }}
      />
    </div>
  );
};

export default page;
