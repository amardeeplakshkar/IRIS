'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useArtifact } from '@/components/provider/ArtifactProvider'
import { ArtifactType } from '@/components/provider/ArtifactProvider'
import { nanoid } from 'nanoid'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ArtifactCreatorProps {
  onClose?: () => void
}

const ArtifactCreator: React.FC<ArtifactCreatorProps> = ({ onClose }) => {
  const { setOpenArtifact } = useArtifact()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ArtifactType>('text')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateArtifact = () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!content.trim()) {
      toast.error('Content is required')
      return
    }

    setIsLoading(true)

    try {
      // Create the artifact data
      const artifactData = {
        id: nanoid(),
        title,
        type,
        content,
        metadata: {}
      }

      // Open the artifact
      setOpenArtifact(artifactData)

      // Reset form
      setTitle('')
      setType('text')
      setContent('')

      // Close the creator if onClose is provided
      if (onClose) {
        onClose()
      }

      toast.success('Artifact created successfully')
    } catch (error) {
      console.error('Failed to create artifact:', error)
      toast.error('Failed to create artifact')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Artifact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter artifact title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <div className="flex items-center space-x-2">
            {(['text', 'code', 'image', 'mermaid'] as ArtifactType[]).map((t) => (
              <Button
                key={t}
                variant={type === t ? 'default' : 'outline'}
                onClick={() => setType(t)}
                className="capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === 'image'
                ? 'Enter image URL'
                : type === 'mermaid'
                ? 'Enter mermaid diagram code'
                : type === 'code'
                ? 'Enter code'
                : 'Enter text content'
            }
            rows={6}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={handleCreateArtifact} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Artifact'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ArtifactCreator