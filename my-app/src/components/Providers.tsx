"use client"
import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react';
import ReactQueryProvider from '@/providers/ReactQueryProvider'

import { ThemeProvider } from "@/components/theme-provider"

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
            <ReactQueryProvider>
                <SessionProvider>{props.children}</SessionProvider>
            </ReactQueryProvider>
        </ThemeProvider>
    )
}

export default Providers
