import { createTRPCRouter } from '../init';
import { chatRouter } from '../modules/chats/procedure';
import { messagesRouter } from '../modules/messages/procedures';

export const appRouter = createTRPCRouter({
    messages : messagesRouter,
    chat : chatRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;