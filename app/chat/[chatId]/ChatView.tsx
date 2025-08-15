"use client"
import React, { useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import ChatMessage, { ThinkingMessage } from '@/components/core/ChatMessage'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, MessageSquare, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileWithPreview, PastedContent } from '@/types'
import { Attachment } from 'ai'
import { isTextualFile, readFileAsText } from '@/components/helpers'
import { ChatInput } from '@/components/core/ChatInputSecond'
import Artifact from '@/components/widgets/Artifact'
import ArtifactDrawer from '@/components/widgets/ArtifactDrawer'
import { useArtifact } from '@/components/provider/ArtifactProvider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { v4 as uuidv4 } from 'uuid';
import { useTRPC } from '@/lib/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import prisma from '@/lib/db'
import { UIMessage, Message } from 'ai'
import { saveAssistantResponse } from '@/components/helpers/utils'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import Link from 'next/link'
import { useMessages } from '@/components/provider/MessagesPorvider'
const ChatView = ({chatId}: {chatId: string}) => {

  const { openArtifact, isMobile } = useArtifact();
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);
  const chatViewportRef = useRef<HTMLDivElement>(null);
  const userMessageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [isToolCalling, setIsToolCalling] = React.useState(false);
  const [isError, setIsError] = React.useState('');
  const [showArtifactCreator, setShowArtifactCreator] = React.useState(false);
  const [selectedChatModel, setSelectedChatModel] = React.useState('chat-model');

  const trpc = useTRPC();
  const { initialPrompt, setInitialPrompt, initialMessages, setInitialMessages } = useMessages();
  const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
    chatId: chatId,
    includeParts: true,
    includeAttachments: true,
  }, {
    refetchInterval: 2000,
  }));

  const userMessageIndex = messages?.findIndex((msg) => msg.role === 'user') ?? -1;

  const filteredMessages = (
    userMessageIndex !== -1
      ? messages?.filter((_, index) => index !== userMessageIndex)
      : messages
  )?.map((message) => ({
    id: message.id,
    role: message.role as "user" | "data" | "system" | "assistant",
    parts: message.parts as any,
  })) as Message[];

  const {
    messages : chatMessages,
    isLoading,
    error,
    reload,
    append,
    setInput,
    status
  } = useChat({
    body: {
      selectedChatModel,
      chatId
    },
    initialMessages : filteredMessages,
    onFinish: async (message, { usage, finishReason }) => {
      await saveAssistantResponse(chatId, message.content, message.parts);
    },
    onError: error => {
      console.error('An error occurred:', error);
      setIsError(error.message)
    },
    onResponse: response => {
      console.log('Received HTTP response from server:', response);
    },
    onToolCall: () => {
      setIsToolCalling(true);
    },
  })
  useEffect(() => {
    if (!isLoading && isToolCalling) {
      setIsToolCalling(false);
    }
  }, [isLoading, isToolCalling]);
  
  const modelPrefixes: Record<string, string> = {
    'chat-model': '',
    'search-model': 'SEARCH',
    'artifact-model': 'IN ARTIFACT',
    'chat-model-reasoning': 'THINK AND REASON'
  };

  const handleSendMessage = async (
    chatchatMessages: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => {
    const attachments: Attachment[] = [];
    
    for (const fileWithPreview of files) {
      const file = fileWithPreview.file;
      
      if (file.type.startsWith('image/')) {
        
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        attachments.push({
          name: file.name,
          contentType: file.type,
          url: base64
        });
      } else if (isTextualFile(file)) {
        
        const textContent = fileWithPreview.textContent || await readFileAsText(file);
        
        const base64 = `data:${file.type};base64,${btoa(unescape(encodeURIComponent(textContent)))}`;
        
        attachments.push({
          name: file.name,
          contentType: file.type,
          url: base64
        });
      }
    }

    
    let fullMessage = chatchatMessages;
    if (pastedContent.length > 0) {
      fullMessage += '\n\nPasted Content:\n' + pastedContent.map(p => p.content).join('\n\n');
    }

    await append({
      role: 'user',
      content: `${modelPrefixes[selectedChatModel]}\n${fullMessage}`,
      experimental_attachments: attachments
    });
  };



  const scrollToMessage = (scrollToBottom = false) => {
    if (chatMessages.length === 0) return;
    const lastMessage = chatMessages[chatMessages.length - 1];
  
    setTimeout(() => {
      if (!chatViewportRef.current) return;
  
      if (scrollToBottom) {
        // Scroll to bottom
        chatViewportRef.current.scrollTo({
          top: chatViewportRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        // Scroll to message (same as your existing code)
        const messageElement = document.getElementById(lastMessage.id);
        if (messageElement) {
          const messageRect = messageElement.getBoundingClientRect();
          const viewportRect = chatViewportRef.current.getBoundingClientRect();
          const scrollTop = chatViewportRef.current.scrollTop + (messageRect.top - viewportRect.top) - 10;
  
          chatViewportRef.current.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        } else {
          chatViewportRef.current.scrollTo({
            top: chatViewportRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    }, 50);
  };

  const isWaitingForResponse = useMemo(() => {
    if (chatMessages.length === 0) return false;
    return chatMessages[chatMessages.length - 1].role === 'user';
  }, [chatMessages]);

  
  useEffect(() => {
    if (chatMessages.length === 0) return;
  
    const lastMsg = chatMessages[chatMessages.length - 1];
  
    if (lastMsg.role === 'assistant') {
      // When last message is assistant, scroll to bottom
      scrollToMessage(true);
    } else {
      // For user messages, scroll to top
      scrollToMessage(false);
    }
  }, [chatMessages]);


  useEffect(()=>{
// Scroll to bottom only when the message is an AI response
    if(initialPrompt){
      try{
      setInput(initialPrompt)
      handleSendMessage(initialPrompt, [], [])
    }
    catch(error){
      console.log(error)
    }
    finally{
      setInitialPrompt('')
    }
    }
  }, [])
  
  const setUserMessageRef = (element: HTMLDivElement | null, messageId: string) => {
    if (element) {
      userMessageRefs.current.set(messageId, element);
    }
  };

  const onQuerySelect = (query: string) => {
    append({
      role: 'user',
      content: query
    })
  }

  const shouldSkipFirstMessage =
  messages?.[0]?.role === 'user' && chatMessages.length > 1;

  const displayMessages = shouldSkipFirstMessage
  ? chatMessages.slice(1)
  : chatMessages;


  return (
    <div className={`grid ${!openArtifact || isMobile ? 'grid-cols-none' : 'grid-cols-10'} transition-all duration-300 ease-in-out`}>
    <div className={`${openArtifact && !isMobile ? 'col-span-3' : 'col-span-full'} flex relative flex-col md:h-[calc(98dvh-4rem)] h-[calc(100dvh-4rem)]`}>
      <ScrollArea viewportRef={chatViewportRef} className='flex-1 overflow-y-auto pb-[7.5rem]'>
        <div className={`p-4  max-w-5xl  mx-auto ${openArtifact && !isMobile ? 'w-sm' : 'w-full'}`}>
          {
          displayMessages?.map(m => (
            <div
              key={m.id}
              ref={m.role === 'user' ? (el) => setUserMessageRef(el, m.id) : undefined}
              className={`mb-4 ${m.role === 'user' ? 'mt-4' : ''}`}
            >
              <ChatMessage onQuerySelect={onQuerySelect} status={status} reload={reload} key={m.id} isToolCalling={isToolCalling} isLoading={isLoading} error={isError} msg={m} variant={m.role === 'user' ? 'sent' : 'received'} isUser={m.role === 'user'} messages={displayMessages} />
              <br />
            </div>
          ))}
        </div>
        {status === 'submitted' &&
        chatMessages.length > 0 &&
        chatMessages[chatMessages.length - 1].role === 'user' && <ThinkingMessage />}
        {isError && error &&
          <div className='p-4 mb-10 -mt-12'>
            <Alert variant={'destructive'}>
              <AlertCircleIcon />
              <AlertTitle>Oh no!</AlertTitle>
              <AlertDescription>
                {isError}
              </AlertDescription>
              <Link href={`/`}>
              <Button className='mt-2 capitalize'>
                <MessageSquare/>
                start a new chat
              </Button>
              </Link>
            </Alert>
              <Button className='mt-2' onClick={()=>{
                reload()
                setIsError("")
                }} variant={'outline'}>
                <RefreshCcw />
              </Button>
          </div>
        }
        {isWaitingForResponse ? <div className="h-[60dvh]" /> : <div className={`${isLoading ? `h-[${isMobile ? '20' : '40'}dvh]` : '10dvh'}`} />}

      </ScrollArea>
      <div className='absolute bottom-0 z-49 left-0 right-0  p-2 '>
        <ChatInput
          setSelectedChatModel={setSelectedChatModel}
          onSendMessage={handleSendMessage}
          maxFiles={10}
          maxFileSize={10 * 1024 * 1024}
          disabled={isLoading}
        />
      </div>
    <ProgressiveBlur/>
    </div>
    {/* Desktop Artifact */}
    {openArtifact && !isMobile && <Artifact />}
    
    {/* Mobile Artifact Drawer */}
    {isMobile && <ArtifactDrawer />}
    </div>
  )
}

export default ChatView