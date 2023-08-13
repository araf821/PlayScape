import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { comfortaa, pacifico } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata = {
  title: "PixelLand",
  description: "A Reddit clone, but better.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "antialias light bg-white text-slate-900",
        comfortaa.className,
        comfortaa.variable,
        pacifico.variable,
      )}
    >
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Navbar />
        <div className="container mx-auto h-full max-w-7xl pt-12">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
