import FeedSidebar from "@/components/FeedSidebar";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <main className="relative">
      {/* Gradients */}
      <div className="fixed left-0 top-24 h-64 w-64 rounded-full bg-blue-400 opacity-30 blur-3xl md:left-40 md:top-32 md:h-80 md:w-80 lg:left-[600px]" />
      <div className="fixed -bottom-20 -left-40 h-64 w-64 rounded-full bg-green-600 opacity-30 blur-3xl" />
      <div className="fixed left-60 top-96 h-96 w-96 rounded-full bg-rose-500 opacity-30 blur-3xl md:left-96 md:top-[550px] md:h-[425px] md:w-[425px] lg:left-[800px] xl:left-[1200px]" />

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
