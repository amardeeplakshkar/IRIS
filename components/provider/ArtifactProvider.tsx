'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'

export type ArtifactType = 'image' | 'mermaid' | 'code' | 'text'

export interface ArtifactData {
  id: string
  title: string
  type: ArtifactType
  content: any 
  template?: SandpackPredefinedTemplate
  metadata?: Record<string, any> 
}


interface ArtifactContextType {
  openArtifact: ArtifactData | null
  setOpenArtifact: (artifact: ArtifactData | null) => void
  isMobile: boolean
}


const ArtifactContext = createContext<ArtifactContextType>({
  openArtifact: null,
  setOpenArtifact: () => {},
  isMobile: false
})


export const useArtifact = () => useContext(ArtifactContext)


interface ArtifactProviderProps {
  children: ReactNode
}

export const ArtifactProvider: React.FC<ArtifactProviderProps> = ({ children }) => {
  
  const [openArtifact, setOpenArtifact] = useState<ArtifactData | null>(null)
  const isMobile = useIsMobile()

  
  const value = {
    openArtifact,
    setOpenArtifact,
    isMobile
  }

  return (
    <ArtifactContext.Provider value={value}>
      {children}
    </ArtifactContext.Provider>
  )
}

export default ArtifactProvider