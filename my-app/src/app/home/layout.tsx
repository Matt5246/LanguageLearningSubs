
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider"
import AvatarComponent from '@/components/Avatar'
import ReactQueryProvider from '@/providers/ReactQueryProvider'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
