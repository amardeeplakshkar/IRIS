'use client'

import { Download, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'
import { ImageGeneration } from '@/components/ui/ai-chat-image-generation-1'

type ImageDisplayProps = {
    src: string
    prompt: string
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, prompt }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)

    const handleDownload = async () => {
        try {
            const response = await fetch(src)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `ai-image-${prompt.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    const toggleZoom = () => {
        setIsZoomed(!isZoomed)
    }

    const imageContent = (
        <div className={cn(
            "rounded-xl overflow-hidden bg-card border border-border relative",
            "transition-all duration-300 ease-in-out",
            "hover:shadow-lg dark:hover:shadow-primary/5",
            isZoomed ? "z-50" : ""
        )}>
            {error && (
                <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-muted rounded-xl">
                    <div className="size-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-muted-foreground text-xl">!</span>
                    </div>
                    <p className="text-muted-foreground font-medium">Failed to load image</p>
                </div>
            )}
            
            <div className={cn(
                "overflow-hidden",
                isZoomed ? "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" : ""
            )}>
                <img
                    ref={imageRef}
                    src={src}
                    alt={'Generating Image...'}
                    className={cn(
                        "max-w-md object-contain max-h-96 w-full rounded-xl transition-all duration-300",
                        isZoomed ? "max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out" : "cursor-zoom-in",
                        "hover:brightness-105 transition-all"
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false)
                        setError(true)
                    }}
                    onClick={toggleZoom}
                />
            </div>
            
            <div className="absolute bottom-3 right-3 opacity-0 max-sm:opacity-100 group-hover:opacity-100 transition-all duration-200 flex gap-2">
                <Button
                    onClick={toggleZoom}
                    size="icon"
                    variant="default"
                    className="size-8 bg-background/80 backdrop-blur-sm hover:bg-background border border-border shadow-sm"
                >
                    {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
                </Button>
                <Button
                    onClick={handleDownload}
                    size="sm"
                    variant="default"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background text-foreground border border-border shadow-sm"
                >
                    <Download size={14} />
                    <span className="text-xs font-medium">Download</span>
                </Button>
            </div>
        </div>
    )

    return (
        <div className="relative group w-full overflow-hidden">
            <ImageGeneration>
                {imageContent}
            </ImageGeneration>
            
            {/* <div className="mt-3">
                <div className="bg-card/50 border border-border/50 p-3 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        "{prompt}"
                    </p>
                </div>
            </div> */}
        </div>
    )
}

export default ImageDisplay