"use client"
import { Toaster } from "@/components/ui/toaster";
import {
    TooltipProvider
} from "@/components/ui/tooltip";
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ThemeProvider } from '../components/theme/theme-provider';
import StoreProvider from './StoreProvider';

interface Props {
    children: ReactNode;
}

const Providers = (props: Props) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                <ReactQueryProvider>
                    <StoreProvider><SessionProvider >{props.children}</SessionProvider></StoreProvider>
                    <Toaster />
                </ReactQueryProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers
