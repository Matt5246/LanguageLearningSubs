import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< Updated upstream
import Providers from "@/providers/Providers";
import { Toaster } from "@/components/ui/sonner"
=======
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ReactQueryProvider from '@/providers/ReactQueryProvider'
>>>>>>> Stashed changes

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
      <body className={inter.className}>
<<<<<<< Updated upstream
        <Providers>{children}
          <Toaster />
        </Providers>
=======
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </ReactQueryProvider>
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
