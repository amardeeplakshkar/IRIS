"use client"
import React, { useRef, useEffect, useMemo } from 'react'
import { PromptBox } from '@/components/ui/chatgpt-prompt-input'
import { useChat } from '@ai-sdk/react'
import ChatMessage, { ThinkingMessage } from '@/components/core/ChatMessage'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MainPage = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userMessageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [isToolCalling, setIsToolCalling] = React.useState(false);
  const [isError, setIsError] = React.useState('');
  const [selectedChatModel, setSelectedChatModel] = React.useState('chat-model');
  const {
    messages,
    input,
    handleSubmit,
    setInput,
    handleInputChange,
    isLoading,
    reload,
    status,
    error,
    experimental_resume,
    
  } = useChat({
    body: {
      selectedChatModel
    },
    onFinish: (message, { usage, finishReason }) => {
      console.log('Finished streaming message:', message);
      console.log('Token usage:', usage);
      console.log('Finish reason:', finishReason);
    },
    onError: error => {
      console.error('An error occurred:', error);
      setIsError(error.message)
    },
    onResponse: response => {
      console.log('Received HTTP response from server:', response);
    },
    onToolCall: (toolCall) => {
      setIsToolCalling(true);
    },
  })
  useEffect(() => {
    if (!isLoading && isToolCalling) {
      setIsToolCalling(false);
    }
  }, [isLoading, isToolCalling]);
  const scrollToMessage = () => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === 'user') {
      const userMessageElement = userMessageRefs.current.get(lastMessage.id);
      if (userMessageElement && messagesContainerRef.current) {
        const containerTop = messagesContainerRef.current.getBoundingClientRect().top;
        const messageTop = userMessageElement.getBoundingClientRect().top;
        const scrollOffset = messageTop - containerTop - 20; 

        messagesContainerRef.current.scrollBy({
          top: scrollOffset,
          behavior: 'smooth'
        });
      }
    } else {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  const isWaitingForResponse = useMemo(() => {
    if (messages.length === 0) return false;
    return messages[messages.length - 1].role === 'user';
  }, [messages]);

  useEffect(() => {
    scrollToMessage();
  }, [messages]);

  const setUserMessageRef = (element: HTMLDivElement | null, messageId: string) => {
    if (element) {
      userMessageRefs.current.set(messageId, element);
    }
  };

  return (
    <div className='flex relative flex-col h-[calc(100dvh-4rem)]'>
      <div ref={messagesContainerRef} className='flex-1 overflow-y-auto mb-[7.5rem]'>
        <div className='p-4 w-full max-w-4xl mx-auto'>
          {messages?.map(m => (
            <div
              key={m.id}
              ref={m.role === 'user' ? (el) => setUserMessageRef(el, m.id) : undefined}
              className={`mb-4 ${m.role === 'user' ? 'mt-4' : ''}`}
            >
              <ChatMessage status={status} reload={reload} key={m.id} isToolCalling={isToolCalling} isLoading={isLoading} error={isError} msg={m} variant={m.role === 'user' ? 'sent' : 'received'} isUser={m.role === 'user'} messages={messages} />
              <br />
            </div>
          ))}
        </div>
        {status === 'submitted' &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}
        {isError && error &&
          <div className='p-2'>
            <Alert variant={'destructive'}>
              <AlertCircleIcon />
              <AlertTitle>Oh no!</AlertTitle>
              <AlertDescription>
                {isError}
                {error && <>{JSON.stringify(error)}</>}
              </AlertDescription>
            </Alert>
              <Button className='mt-2' onClick={()=>{
                reload()
                setIsError("")
                }} variant={'outline'}>
                <RefreshCcw />
              </Button>
          </div>
        }
        {isWaitingForResponse ? <div className="h-[60dvh]" /> : <div className="" />}
      </div>
      <div className='absolute bottom-0 left-0 right-0 md:bottom-2'>
        <PromptBox
          setSelectedChatModel={setSelectedChatModel}
          value={input}
          setValue={setInput}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default MainPage