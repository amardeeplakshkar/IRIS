'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Copy, Play, StopCircle, X } from 'lucide-react'
import { useArtifact } from '@/components/provider/ArtifactProvider'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import ImageDisplay from './ImageDisplay'
import { MessageMermaid } from './MermaidDisplay'
import { copyToClipboard } from '@/lib/utils'
import { MemoizedMarkdown } from '../core/MemoizedMarkdown'
import CodeSandpack from './CodeSandpack'
import { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'

const ArtifactDrawer = () => {
  const { openArtifact, setOpenArtifact } = useArtifact()
      const [showPreview, setShowPreview] = useState(false);  
     

  return (
    <Sheet open={!!openArtifact} onOpenChange={(open) => {
      if (!open) setOpenArtifact(null)
    }}>
      <SheetContent  side="right" className="w-full sm:max-w-md p-0 gap-0">
        <SheetHeader className="p-2 border-b">
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <Button onClick={() => setOpenArtifact(null)} size={'sm'} variant="outline">
                <X/>
              </Button>
              <SheetTitle className='line-clamp-1'>{openArtifact?.title}</SheetTitle>
            </div>
            <div className='flex items-center gap-2'>
             {openArtifact?.type === 'code' && <Button onClick={() => setShowPreview(!showPreview)} size={'sm'} variant="outline">
              {!showPreview ? <>
                <Play/>Run
              </> : <>
              <StopCircle/>Stop
              </>}
              </Button>}
              <Button onClick={() => copyToClipboard(openArtifact?.content || '')} size={'sm'} variant="outline"><Copy/>Copy</Button>
            </div>
          </div>
        </SheetHeader>
        <div className="p-4 overflow-auto h-[calc(100%-60px)]">
          {openArtifact?.type === 'image' && (
                          <ImageDisplay src={openArtifact.content} prompt={openArtifact.title} />
                      )}
                      {openArtifact?.type === 'mermaid' && (
                          <MessageMermaid source={openArtifact.content} theme="forest" />
                      )}
                      {openArtifact?.type === 'code' && (
                          <div className='-m-4'>
                          <CodeSandpack  code={openArtifact.content} showPreview={showPreview}/>
                          </div>
                      )}
                      {openArtifact?.type === 'text' && (
                          <MemoizedMarkdown content={openArtifact.content} id={openArtifact.id} />
                      )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ArtifactDrawer