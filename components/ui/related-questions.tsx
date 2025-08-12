'use client'

import React from 'react'

import { JSONValue } from 'ai'
import { ArrowRight, Shuffle } from 'lucide-react'

import { Button } from './button'
import { Skeleton } from './skeleton'

export interface RelatedQuestionsProps {
  items: {query: string}[]
  onQuerySelect: (query: string) => void
  isLoading?: boolean
}

export const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({
  items,
  onQuerySelect,
  isLoading = false
}) => {
  if (!items) {
    return null
  }

  if (items.length === 0 && isLoading) {
    return (
        <Skeleton className="w-full h-6" />
    )                         
  }                         

  return (
    <div>
      <span className='flex items-center gap-2 mt-4'><Shuffle className='h-4 w-4'/> Related</span>
        <div className="flex flex-col">
          {items ? (
            items
              ?.filter(item => item?.query !== '')
              .map((item, index) => (
                <div className="flex items-start w-full" key={index}>
                  <ArrowRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-primary" />
                  <Button
                    variant="link"
                    className="flex-1 justify-start px-0 py-1 h-fit font-semibold text-accent-foreground/50 whitespace-normal text-left"
                    type="submit"
                    name={'related_query'}
                    value={item?.query}
                    onClick={() => onQuerySelect(item?.query)}
                    >
                    {item?.query}
                  </Button>
                </div>
              ))
          ) : (
            <div>Not an array</div>
          )}
        </div>
              </div>
  )
}
export default RelatedQuestions
