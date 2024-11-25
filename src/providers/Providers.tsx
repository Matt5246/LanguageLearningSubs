"use client"
import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react';
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { ThemeProvider } from '../components/theme/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import StoreProvider from './StoreProvider';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
