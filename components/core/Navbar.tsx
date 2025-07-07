import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { Sun } from 'lucide-react'
import { ModeToggle } from './ModeToggle'

const Navbar = () => {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center justify-between w-full p-4">
                    <div className='flex items-center gap-2'>
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                    </div>
                    <div>
                        IRIS
                    </div>
                    <div>
                        <ModeToggle/>
                    </div>
                </div>
            </header>
            <Separator />
        </>
    )
}

export default Navbar