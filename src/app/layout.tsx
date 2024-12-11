import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LanguageLearningFromSubs",
  description: "Database and platform to learn foreign language, from subititles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/file-text.svg" sizes="any" />
      </head>
      <body className={inter.className} >
        <Providers>{children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
