"use client"

import dynamic from 'next/dynamic'
 
const LibraryPage = dynamic(
  () => import('./LibraryPage'),
  { ssr: false }
)
 
export default function Page() {
  return (
    <div>
      <LibraryPage />
    </div>
  )
}