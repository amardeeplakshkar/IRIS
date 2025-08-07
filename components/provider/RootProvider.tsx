import React from 'react'
import { AppSidebar } from '../sidebar/app-sidebar'
import { SidebarProvider, SidebarInset } from '../ui/sidebar'
import Navbar from '../core/Navbar'
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from '../ui/sonner'
import ArtifactProvider from './ArtifactProvider'
import { ClerkProvider } from '@clerk/nextjs'
import { MessagesProvider } from './MessagesPorvider'

const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ClerkProvider>
        <ArtifactProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
            >
                <Toaster
                    position="top-center"
                    duration={2500}
                />
                <SidebarProvider className=''>
                    <AppSidebar />
                    <SidebarInset>
                        <Navbar />
                        <MessagesProvider>
                        {children}
                        </MessagesProvider>
                    </SidebarInset>
                </SidebarProvider>
            </ThemeProvider >
        </ArtifactProvider>
        </ClerkProvider>
    )
}

export default RootProvider