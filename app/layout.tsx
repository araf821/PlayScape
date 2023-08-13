import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Comfortaa, Pacifico } from "next/font/google";

export const metadata = {
  title: "PixelLand",
  description: "A Reddit clone, but better.",
};

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
});

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
        pacifico.className,
        comfortaa.className,
      )}
    >
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Navbar />
        <div className="container mx-auto h-full max-w-7xl pt-12">
          {children}
        </div>
      </body>
    </html>
  );
}
