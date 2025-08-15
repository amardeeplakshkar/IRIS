'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import React from 'react'
import { dark, shadcn } from "@clerk/themes";

const ClerkProviderWrapper = ({children}:{children: React.ReactNode}) => {
    const {theme} = useTheme()
    return (
        <ClerkProvider
            appearance={{
                theme: theme === 'dark' ? dark : undefined,
            }}
        >
            {children}
        </ClerkProvider>
    )
}

export default ClerkProviderWrapper