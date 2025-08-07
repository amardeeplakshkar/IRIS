import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import 'katex/dist/katex.min.css';
import { components } from '@/constants';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import Link from 'next/link';

function parseMarkdownIntoBlocks(markdown: string): string[] {
    const tokens = marked?.lexer(markdown || '');
    return tokens.map(token => token.raw);
}

const MemoizedMarkdownBlock = memo(
    ({ content, citations }: { content: string, citations: boolean }) => {
        return <ReactMarkdown
            components={{...components, ...(citations ? {
                a: ({ node, children, ...props }: any) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="link"  
                          className="bg-primary decoration-none text-secondary size-5 mx-0.5 p-2 rounded-full"
                        >
                          {children}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={5}>
                        <DropdownMenuLabel>
                          <Link target='_blank' href={props.href ?? "#"}>{props.href}</Link>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
            } : {})}}
            remarkPlugins={[
                remarkGfm,
                remarkMath
            ]}
            rehypePlugins={[
                rehypeKatex
            ]}
        >{content}</ReactMarkdown>;
    },
    (prevProps, nextProps) => {
        if (prevProps.content !== nextProps.content) return false;
        return true;
    },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
    ({ content, id, citations = false }: { content: string; id: string; citations?: boolean }) => {
        const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

        return blocks.map((block, index) => (
            <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} citations={citations} />
        ));
    },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';