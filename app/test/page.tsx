import { dummyData } from '@/components/helpers'
import SearchResults from '@/components/widgets/SearchResults'
import React from 'react'

const Page = () => {
  return (
    <div>
        <SearchResults result={dummyData}/>
    </div>
  )
}

export default Page