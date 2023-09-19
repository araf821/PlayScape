import FeedSidebar from "@/components/FeedSidebar";
import CustomFeed from "@/components/post/CustomFeed";
import GeneralFeed from "@/components/post/GeneralFeed";
import { getAuthSession } from "@/lib/auth";

export default async function Home() {
  const session = await getAuthSession();

  return <>{session ? <CustomFeed /> : <GeneralFeed />}</>;
}
