'use client'

import RelatedQuestions from '@/components/ui/related-questions'
import { generateRelatedQuestions } from '@/lib/generateReletedQuestions'
import React from 'react'

const Page = () => {
  const [relatedQuestions, setRelatedQuestions] = React.useState<any>([])

  const fetchReletedQuestions = async () => {
    const response = await generateRelatedQuestions([
      {
        role: 'user',
        content: ``
      }
    ])
    setRelatedQuestions(response)
  }

  return (
    <div>
      <button onClick={fetchReletedQuestions}>Fetch</button>
      <RelatedQuestions
        items={
             relatedQuestions?.object?.items
        }
        onQuerySelect={(query) => console.log(query)}
      />
    <pre>{JSON.stringify(relatedQuestions, null, 2)}</pre>
    </div>
  )
}

export default Page