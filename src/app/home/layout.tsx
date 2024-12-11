
import NavBar from "@/components/NavBar"
import AvatarComponent from '@/components/Avatar'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { ThemeWrapper } from "@/components/theme/theme-wrapper"
import '@/styles/themes.css'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ReactQueryProvider>
        <ThemeWrapper>
          <nav className="h-16 px-4 flex justify-between border-b shadow-md select-none bg-background">
            <NavBar />
            <AvatarComponent />
          </nav>
          <div className="select-none">
            {children}
          </div>
        </ThemeWrapper>
      </ReactQueryProvider >
    </>
  );
}
