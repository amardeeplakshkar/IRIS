'use client'

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTRPC } from '@/lib/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Download, Share, XIcon } from 'lucide-react';
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { shareOnMobile } from 'react-mobile-share';
const Page = () => {
    const trpc = useTRPC();
    const { data: messages } = useSuspenseQuery(trpc.messages.getAll.queryOptions({
        includeParts: true,
        includeAttachments: true,
    }, {
        refetchInterval: 2000,
    }));
    const GeneratedImages = messages
        ?.flatMap((message: any) =>
            message.parts?.filter(
                (part: any) => part?.toolInvocation?.toolName === 'ImageTool'
            ) || []
        )
        .map((part: any) => part?.toolInvocation)
        .filter(Boolean)

    const handleDownload = async (src: string) => {
        try {
            const response = await fetch(src)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const uuid = uuidv4()
            const link = document.createElement('a')
            link.href = url
            link.download = `iris-image-${uuid}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }
    const handleShare = async (src: string) => {
        shareOnMobile({
            text: "IRIS GENERATED IMAGE",
            url: src,
            title: "IRIS GENERATED IMAGE",
        })
    }
    return (
        <ScrollArea className='flex flex-col gap-4 p-4 pb-[5rem] overflow-auto h-dvh'>
            <h2 className='text-xl font-bold tracking-wide pb-4 '>
                Library
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {
                GeneratedImages?.length > 0 ?
                GeneratedImages.flatMap((image: any) => {
                    const prompt = image?.result?.prompt || image?.args?.prompt || 'Generated Image';
                    const urls = image?.result?.imageUrls || [];
                    return urls.map((url: string) => ({
                        url,
                        prompt,
                    }));
                })
                .reverse()
                .map(({ url, prompt }, index: number) => (
                    <Dialog key={index}>
                        <DialogTrigger>
                            <div className='aspect-square rounded-xl overflow-hidden'>
                                <img className=' size-full object-cover' key={url} src={url} alt="Generated Image" />
                            </div>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false} className='size-full! mx-0! max-w-full! max-h-full! p-2'>
                            <DialogHeader className='top-0 fixed p-2 flex items-center flex-row justify-between gap-2 w-full'>
                                <div className='flex items-center flex-row gap-2'>
                                    <DialogClose asChild>
                                        <Button variant="ghost">
                                            <XIcon />
                                        </Button>
                                    </DialogClose>
                                    <DialogTitle className='line-clamp-1'>{prompt}</DialogTitle>
                                </div>
                                <div className='flex items-center flex-row gap-2'>
                                    <Button variant={'ghost'} onClick={() => handleDownload(url)}><Download /></Button>
                                    <Button variant={'outline'} onClick={() => handleShare(url)}><Share />Share</Button>
                                </div>
                            </DialogHeader>
                            <div className='mt-[4rem] rounded-xl overflow-hidden'>
                                <img className=' size-full object-contain' key={url} src={url} alt="Generated Image" />
                            </div>
                        </DialogContent>
                    </Dialog>
                )) : (
                    <p>No Generated Images</p>
                )}
            </div>
        </ScrollArea>
    )
}

export default Page