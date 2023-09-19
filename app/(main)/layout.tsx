import FeedSidebar from "@/components/FeedSidebar";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <main className="relative">
      {/* Gradients */}
      <div className="absolute -left-96 top-28 h-64 w-64 rounded-full bg-rose-500 opacity-30 blur-3xl" />
      <div className="absolute -left-64 top-44 h-96 w-96 rounded-full bg-blue-500 opacity-30 blur-3xl" />
      <div className="absolute left-20 top-96 h-96 w-96 rounded-full bg-orange-500 opacity-30 blur-3xl md:left-64" />
      <div className="absolute left-20 top-[900px] h-96 w-96 rounded-full bg-rose-500 opacity-30 blur-3xl md:left-20" />

      <div className="grid grid-cols-1 gap-y-4 pb-6 md:grid-cols-7 md:gap-x-4">
        <FeedSidebar />
        <div className="mt-6 md:col-span-5 md:mt-0">
          <h1 className="z-10 ml-2 text-3xl font-bold text-white md:text-4xl">
            Your feed
          </h1>
          {children}
        </div>
      </div>
    </main>
  );
};

export default layout;
