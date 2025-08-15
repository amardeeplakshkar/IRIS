import React from 'react'
import { AppSidebar } from '../sidebar/app-sidebar'
import { SidebarProvider, SidebarInset } from '../ui/sidebar'
import Navbar from '../core/Navbar'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from '../ui/sonner'
import ArtifactProvider from './ArtifactProvider'
import { ClerkProvider } from '@clerk/nextjs'
import { MessagesProvider } from './MessagesPorvider'
import ClerkProviderWrapper from './ClerkProvider'

const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ArtifactProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
            >
                <ClerkProviderWrapper>
                    <Toaster
                        position="top-center"
                        duration={2500}
                    />
                    <SidebarProvider defaultOpen={false} className=''>
                        <AppSidebar />
                        <SidebarInset>
                            <Navbar />
                            <MessagesProvider>
                                {children}
                            </MessagesProvider>
                        </SidebarInset>
                    </SidebarProvider>
                </ClerkProviderWrapper>
            </ThemeProvider >
        </ArtifactProvider>
    )
}

export default RootProvider