'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useArtifact } from '@/components/provider/ArtifactProvider'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartArea, Code, Eye, FileText, Image } from 'lucide-react'
import { ProgressiveBlur } from '../ui/progressive-blur'

interface ArtifactResultProps {
  result: {
    success: boolean
    message: string
    artifact?: {
      id: string
      title: string
      type: string
      content: string
      metadata?: Record<string, any>
    }
    error?: string
  }
}

const ArtifactResult: React.FC<ArtifactResultProps> = ({ result }) => {
  const { setOpenArtifact } = useArtifact()

  if (!result?.success || !result?.artifact) {
    return (
      <Card className="w-full max-w-[80dvw] mx-auto bg-red-950/20 border-red-800/50">
        <CardHeader>
          <CardTitle className="text-red-400">Artifact Creation Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-300">{result?.error || 'Unknown error occurred'}</p>
        </CardContent>
      </Card>
    )
  }

  const { artifact } = result
  const artifactTypeIcon = {
    image: <Image size={16}/>,
    mermaid: <ChartArea size={16}/>,
    code: <Code size={16}/>,
    text: <FileText size={16}/>
  }[artifact.type] || <FileText size={16}/>

  const handleOpenArtifact = () => {
    setOpenArtifact({
      id: artifact.id,
      title: artifact.title,
      type: artifact.type as any,
      content: artifact.content,
      metadata: artifact.metadata || {}
    })
  }

  return (
    <Card className="w-full max-w-[80dvw] my-2" onClick={handleOpenArtifact}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{artifactTypeIcon}</span>
          <span>{artifact.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {artifact.type === 'image' ? (
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
              <img 
                src={artifact.content} 
                alt={artifact.title} 
                className="max-h-full max-w-full object-contain"
                style={{ maxHeight: '150px' }}
              />
            </div>
          ) : artifact.type === 'code' ? (
            <pre className="relative p-2 bg-muted rounded-md overflow-hidden text-xs max-h-24">
              <code>{artifact.content.substring(0, 200)}...</code>
              <ProgressiveBlur height="45%" position='bottom'/>
            </pre>
          ) : (
            <>
            <p className="line-clamp-3">{artifact.content.substring(0, 200)}...</p>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleOpenArtifact} 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <Eye size={16} />
          View Artifact
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ArtifactResult