
import NavBar from "@/components/NavBar";
import AvatarComponent from '@/components/Avatar'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< Updated upstream
    <>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="h-16 px-4 flex justify-between border-b shadow-md select-none">
            <NavBar />
            <AvatarComponent />
          </nav>
          <div className="select-none">
            {children}
          </div>
        </ThemeProvider>
      </ReactQueryProvider>
    </>
=======
    <html lang="en">
      <head />
      <body>
        <nav className="h-16 px-4 flex justify-between border-b shadow-md">
          <NavBar />
          <AvatarComponent />
        </nav>
        {children}
      </body>
    </html>
>>>>>>> Stashed changes
  );
}
