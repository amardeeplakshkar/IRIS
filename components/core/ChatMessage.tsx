import { cn, copyToClipboard } from '@/lib/utils';
import { CoreMessage, Message } from 'ai';
import React, { useState } from 'react'
import { MemoizedMarkdown } from './MemoizedMarkdown';
import { MessageReasoning } from './MessageReasoning';
import Image from 'next/image';
import { Attachment as PreviewAttachment } from './PreviewAttachment';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, RefreshCcw, SparklesIcon, X } from 'lucide-react';
import { ToolResult } from './ToolResult';
import { MessageLoading } from '../ui/message-loading';
import { Button } from '../ui/button';
import { cx } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { TextShimmerWave } from '../ui/text-shimmer-wave';
import ChatAudio from './ChatAudio';
import TooltipBox from '../helpers/TooltipBox';
import RelatedQuestions from '../ui/related-questions';
import { generateRelatedQuestions } from '@/lib/generateReletedQuestions';

const ChatMessage = ({
    msg,
    isUser,
    messages,
    isLoading,
    isToolCalling,
    reload,
    error,
    status,
    onQuerySelect,
}: {
    msg: Message;
    variant: string;
    error: string;
    isUser: boolean;
    messages: Message[];
    isLoading: boolean;
    isToolCalling: boolean;
    reload: () => void;
    status: string;
    onQuerySelect: (query: string) => void;
}) => {
    const isLastMessage = msg.id === messages[messages.length - 1].id;
    const [relatedQuestions, setRelatedQuestions] = React.useState<any>([]);
    const [hasFetched, setHasFetched] = React.useState(false);
    
    const fetchReletedQuestions = React.useCallback(async () => {
      const response = await generateRelatedQuestions(messages as CoreMessage[]);
      setRelatedQuestions(response);
      setHasFetched(true);
    }, [messages]);
    
    React.useEffect(() => {
      const lastMessage = messages[messages.length - 1];
      
      if (
        lastMessage?.role === 'assistant' &&
        status !== 'streaming' &&
        !hasFetched
      ) {
        fetchReletedQuestions();
      }
    }, [messages, hasFetched, fetchReletedQuestions]);
    
    React.useEffect(() => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        setHasFetched(false);
        setRelatedQuestions([]);
      }
    }, [messages[messages.length - 1]?.id]);
    
    const [mode, setMode] = useState("view");
    return (
        <div className={cn(
            "flex w-full animate-fade-in",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className='max-w-[85%]'>
                <div key={msg.id} className={`py-2 first:pt-0 last:pb-0`}>
                    <div className={`flex gap-3`}>
                        <div className={`flex-1 max-w-[100%]`}>
                            <div className='flex justify-end items-center gap-2 mb-2'>
                                {msg?.experimental_attachments
                                    ?.filter(
                                        attachment =>
                                            attachment?.contentType?.startsWith('image/') ||
                                            attachment?.contentType?.startsWith('application/pdf'),
                                    )
                                    .map((attachment, index) => {
                                        if (!attachment.contentType) return null;

                                        const attachmentWithRequiredProps: PreviewAttachment = {
                                            name: attachment.name || `attachment-${index}`,
                                            url: attachment.url,
                                            contentType: attachment.contentType
                                        };

                                        return attachmentWithRequiredProps.contentType.startsWith('image/') ? (
                                            <Dialog key={attachmentWithRequiredProps.url}>
                                                <DialogTrigger>
                                                    <div className='w-20 h-16 aspect-video rounded-md relative flex flex-col items-center justify-start'>
                                                        <Image
                                                            key={`${msg.id}-${index}`}
                                                            src={attachmentWithRequiredProps.url}
                                                            width={500}
                                                            height={500}
                                                            alt={attachmentWithRequiredProps.name}
                                                            className="rounded-md size-full object-cover"
                                                        />
                                                        <div className='text-xs max-w-full truncate text-start'>{attachmentWithRequiredProps.name}</div>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className='w-full flex items-center justify-center flex-col max-h-[95vh] object-contain rounded-2xl p-1'>
                                                    <DialogTitle className='sr-only'>
                                                        hello
                                                    </DialogTitle>
                                                    <img src={attachmentWithRequiredProps.url} alt="Full size preview" className="w-full max-h-[95vh] object-contain rounded-2xl" /> <DialogClose> <X className="w-6 h-6" /> </DialogClose> </DialogContent> </Dialog>
                                        ) : attachmentWithRequiredProps.contentType.startsWith('application/pdf') ? (
                                            <iframe
                                                key={`${msg.id}-${index}`}
                                                src={attachmentWithRequiredProps.url}
                                                width={500}
                                                height={600}
                                                title={attachmentWithRequiredProps.name}
                                            />
                                        ) : null;
                                    }
                                    )}
                            </div>
                            {msg.parts?.map((part, i) => {
                                switch (part.type) {
                                    case 'text':
                                        return (
                                            <div id={msg.id} key={i}>
                                                {
                                                    msg.id !== messages[messages.length - 1].id ? (
                                                        <div className={isUser ? "flex-row-reverse bg-secondary-foreground/10 dark:bg-secondary/10 p-2 px-3 rounded-xl border border-secondary-foreground/10 dark:border-secondary/10" : ""}>
                                                            <MemoizedMarkdown content={part.text} id={msg.id} />
                                                            {
                                                                !isLoading && !error && !isUser &&
                                                                <div className='flex items-center gap-2 mt-2'>
                                                                    <TooltipBox content="Copy Message">
                                                                        <Button
                                                                            size={'sm'}
                                                                            variant={'outline'}
                                                                            onClick={() => copyToClipboard(part.text)}
                                                                        >
                                                                            <Copy className='h-4 w-4' />
                                                                        </Button>
                                                                    </TooltipBox>
                                                                    <ChatAudio msg={part.text} />
                                                                    <TooltipBox content="Reload Message">
                                                                        {isLastMessage && <Button
                                                                            size={'sm'}
                                                                            variant={'outline'}
                                                                            onClick={() => reload()}
                                                                        >
                                                                            <RefreshCcw className='h-4 w-4' />
                                                                        </Button>}
                                                                    </TooltipBox>
                                                                </div>
                                                            }
                                                        </div>
                                                    ) : (
                                                        <div className={`flex text-wrap break-words flex-col justify-start  transition-opacity duration-300 opacity-100 min-h-[calc(10vh-18rem)]`}>
                                                            <div className={isUser ? "flex-row-reverse bg-secondary-foreground/10 dark:bg-secondary/10 p-2 px-3 rounded-xl border border-secondary-foreground/10 dark:border-secondary/10" : ""}>
                                                                <MemoizedMarkdown content={part.text} id={msg.id} />
                                                                {isLoading && !isToolCalling && !isUser && isLastMessage && (
                                                                    <MessageLoading />
                                                                )}
                                                                {
                                                                    !isLoading && !error && !isUser &&
                                                                    <>
                                                                        <div className='flex items-center gap-2 mt-2'>
                                                                            <TooltipBox content="Copy Message">
                                                                                <Button
                                                                                    size={'sm'}
                                                                                    variant={'outline'}
                                                                                    onClick={() => copyToClipboard(part.text)}
                                                                                >
                                                                                    <Copy className='h-4 w-4' />
                                                                                </Button>
                                                                            </TooltipBox>
                                                                            <ChatAudio msg={part.text} />
                                                                            <TooltipBox content="Reload Message">
                                                                                {isLastMessage && <Button
                                                                                    size={'sm'}
                                                                                    variant={'outline'}
                                                                                    onClick={() => reload()}
                                                                                >
                                                                                    <RefreshCcw className='h-4 w-4' />
                                                                                </Button>}
                                                                            </TooltipBox>
                                                                        </div>
                                                                        <RelatedQuestions
                                                                            items={relatedQuestions?.object?.items}
                                                                            onQuerySelect={onQuerySelect}
                                                                        />
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    case 'reasoning':
                                        return (
                                            <div id={msg.id} key={i}>
                                                {
                                                    msg.id !== messages[messages.length - 1].id ? (
                                                        <MessageReasoning
                                                            key={i}
                                                            id={msg.id}
                                                            isLoading={isLoading && !isUser && isLastMessage}
                                                            reasoning={part.reasoning}
                                                        />
                                                    ) : (
                                                        <div className={`flex text-wrap break-words flex-col justify-start  transition-opacity duration-300 opacity-100 $"min-h-[calc(10vh-18rem)]"`}>
                                                            <MessageReasoning
                                                                key={i}
                                                                id={msg.id}
                                                                isLoading={isLoading && !isUser && isLastMessage}
                                                                reasoning={part.reasoning}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        );
                                    case 'tool-invocation': {
                                        return (
                                            <div id={msg.id} key={part.toolInvocation.toolCallId}>
                                                <ToolResult
                                                    isLoading={isLoading}
                                                    toolInvocation={part.toolInvocation}
                                                    id={msg.id}
                                                />
                                            </div>
                                        );
                                    }
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ChatMessage

export const ThinkingMessage = () => {
    const role = 'assistant';

    return (
        <div className='max-w-5xl mx-auto p-2'>
            <TextShimmerWave
                className='[--base-color:#0D74CE] [--base-gradient-color:#5EB1EF]'
                duration={1}
                spread={1}
                zDistance={1}
                scaleDistance={1.1}
                rotateYDistance={20}
            >
                Thinking...
            </TextShimmerWave>
        </div>
    );
};