import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Copy, Play, X } from 'lucide-react'
import { useArtifact } from '@/components/provider/ArtifactProvider'
import { cn, copyToClipboard } from '@/lib/utils'
import ImageDisplay from './ImageDisplay'
import { MessageMermaid } from './MermaidDisplay'
import { MemoizedMarkdown } from '../core/MemoizedMarkdown'

const Artifact = () => {
    const { openArtifact, setOpenArtifact } = useArtifact();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        
        return () => {
            setMounted(false);
        };
    }, []);
    
  return (
    <div
      className={cn(
        'col-span-7 h-dvh border-l transition-all duration-300 ease-in-out',
        'transform translate-x-full opacity-0',
        mounted && 'transform translate-x-0 opacity-100'
      )}
    >
        <header className='flex items-center justify-between p-2'>
            <div className='flex items-center gap-2'>
                <Button onClick={()=>setOpenArtifact(null)} size={'sm'} variant="outline">
                    <X/>
                </Button>
                <h1 className='font-semibold line-clamp-1'>{openArtifact?.title}</h1>
            </div>
            <div className='flex items-center gap-2'>
               {openArtifact?.type === 'code' && <Button size={'sm'} variant="outline"><Play/>Run</Button>}
                <Button onClick={() => copyToClipboard(openArtifact?.content || '')} size={'sm'} variant="outline"><Copy/>Copy</Button>
            </div>
        </header>
        <div className="p-4  pb-8  overflow-auto h-[85dvh]">
            {openArtifact?.type === 'image' && (
                <ImageDisplay src={openArtifact.content} prompt={openArtifact.title} />
            )}
            {openArtifact?.type === 'mermaid' && (
                <MessageMermaid source={openArtifact.content} theme="forest" />
            )}
            {openArtifact?.type === 'code' && (
                <pre className="p-4 bg-gray-800 rounded-md overflow-auto">
                    <code className="text-sm text-white">{openArtifact.content}</code>
                </pre>
            )}
            {openArtifact?.type === 'text' && (
                <MemoizedMarkdown content={openArtifact.content} id={openArtifact.id} />
            )}
        </div>
    </div>
  )
}

export default Artifact