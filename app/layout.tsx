import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";
import { comfortaa, kalam } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata = {
  title: "PlayScape",
  description: "A Reddit clone, but better.",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "antialias light bg-white text-slate-900",
        comfortaa.className,
        comfortaa.variable,
        kalam.variable,
      )}
    >
      <body className="min-h-screen bg-zinc-800 pt-12 antialiased">
        <Providers>
          <Navbar />

          {authModal}

          <div className="container mx-auto h-full max-w-7xl pt-8">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
