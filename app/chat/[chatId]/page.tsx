import { getQueryClient, trpc } from "@/lib/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ChatView from "./ChatView";

 interface props{
    params : Promise<{
      chatId:string,
    }
    >
 }

const page = async ({params}:props) => {
  const {chatId}= await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.messages.getMany.
    queryOptions({  
       chatId,
  })
 )
 void queryClient.prefetchQuery(trpc.chat.getOne.
  queryOptions({  
     id: chatId,
})
)

  return (
    <HydrationBoundary state={ dehydrate(queryClient)}>
       <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Suspense fallback={<p>Loading...</p>}>
     < ChatView chatId= {chatId} />
     </Suspense>
     </ErrorBoundary>
      </HydrationBoundary>
  )
}



export default page