'use client'

import { MemoizedMarkdown } from '@/components/core/MemoizedMarkdown'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import React from 'react'

const SearchResults = ({result = {}}: {result: any}) => {
    function insertCitationLinks(content: string, citations: string[]): string {
        return content?.replace(/\[(\d+)\]/g, (_, numberStr) => {
          const index = parseInt(numberStr, 10) - 1;
          const url = citations[index];
          return url ? `[${numberStr}](${url})` : `[${numberStr}]`;
        });
      }
      
      const cleanDomain = (url: string) => new URL(url).hostname;

  return (
    <div>
        <Tabs defaultValue='answer' className=''>
            <TabsList className='mb-0 w-full'>
                <TabsTrigger value='answer'>
                    Answer
                </TabsTrigger>
                <TabsTrigger value='source'>
                    Source
                </TabsTrigger>
            </TabsList>
            <TabsContent value='answer'>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-center gap-2 flex-wrap'>
                {result?.search_results?.map((item: any, i: number) => (
                     <Link  key={i} href={item.url} className='block w-full'>
                    <Button key={i} variant={'outline'} className='block h-full w-full'>
                        <div className='flex items-center gap-2'>
                            <div style={{
                                backgroundImage: `url(https://favicone.com/${cleanDomain(item.url)})`
                            }} className='p-2 bg-cover bg-center rounded-full'/>
                            <span className='line-clamp-1'>
                                {item.url}
                            </span>
                        </div>
                        <div className='text-start font-semibold line-clamp-1'>
                            {item.title}
                        </div>
                    </Button>
                    <div style={{
                            backgroundImage: `url(https://api.microlink.io/?url=${item.url}&screenshot=true&meta=false&embed=screenshot.url)`
                        }} className='p-10 mt-2 shadow aspect-video bg-cover bg-center rounded'/>
                </Link>
                ))} 
                </div>
                <MemoizedMarkdown content={insertCitationLinks(result?.content, result?.citations)} id={'test'} citations={true} />
            </TabsContent>
            <TabsContent value='source'>
            <div className='grid grid-cols-1   items-center gap-2 flex-wrap'>
            {result?.search_results?.map((item: any, i: number) => (
                    <Link  key={i} href={item.url} className='block w-full'>
                    <Button variant={'outline'} key={i} className='block h-full w-full'>
                        <div className='flex items-center gap-2'>
                            <div style={{
                                backgroundImage: `url(https://favicone.com/${cleanDomain(item.url)})`
                            }} className='p-2 bg-cover bg-center rounded-full'/>
                            <span className='line-clamp-1'>
                                {item.url}
                            </span>
                        </div>
                        <div className='text-start text-pretty font-semibold line-clamp-1'>
                            {item.title}
                        </div>
                    </Button>
                    </Link>
                ))} 
                </div>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default SearchResults