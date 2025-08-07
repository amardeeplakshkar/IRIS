import prisma from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/lib/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
export const messagesRouter = createTRPCRouter({
  getMany : protectedProcedure
  .input(
    z.object({
        chatId : z.string().min(1,{message:"project Id is required"}),
        includeParts: z.boolean().default(false),
        includeAttachments: z.boolean().default(false),
    })
 )
  .query(async ({ input,ctx })=>{
    const messages = await prisma.message.findMany({
      where : {
       chatId: input.chatId,
       chat: {
          clerkId:     ctx.auth.userId,
       },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        chatId: true,
        content: true,
        role: true,
        parts: input.includeParts,
        attachments: input.includeAttachments,
      },
      orderBy:{
        updatedAt :"asc",
      },
    });
       return messages;
  }),
  getAll : protectedProcedure
  .input(
    z.object({
        includeParts: z.boolean().default(false),
        includeAttachments: z.boolean().default(false),
    })
 )
  .query(async ({ input,ctx })=>{
    const messages = await prisma.message.findMany({
      where : {
       chat: {
          clerkId:     ctx.auth.userId,
       },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        chatId: true,
        content: true,
        role: true,
        parts: input.includeParts,
        attachments: input.includeAttachments,
      },
      orderBy:{
        updatedAt :"asc",
      },
    });
       return messages;
  }),
  create : protectedProcedure
     .input(
        z.object({
            value : z.string().min(1,{message: "Message is required"})
            .max(1000,{message : "Value is too long "}),
            chatId : z.string().min(1,{message:"project Id is required"}),
            parts: z.array(z.object({
              type: z.string(),
              text: z.string().optional(),
              reasoning: z.string().optional(),
              toolInvocation: z.object({
                toolCallId: z.string(),
                toolName: z.string(),
                args: z.any(),
                result: z.any().optional(),
              }).optional(),
              content: z.string().optional(),
              url: z.string().optional(),
              metadata: z.any().optional(),
              order: z.number().default(0),
            })).optional(),
            attachments: z.array(z.object({
              filename: z.string(),
              originalName: z.string(),
              contentType: z.string(),
              size: z.number(),
              url: z.string(),
              metadata: z.any().optional(),
            })).optional(),
        })
     )
     .mutation(async ({input,ctx})=>{
      const existingChat = await prisma.chat.findUnique({
        where: {
          id: input.chatId,
          clerkId: ctx.auth.userId,
        },
      })
      if (!existingChat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" });
      }
      try{
    //   await consumeCredits();
    }
   catch (err){
       if(err instanceof Error){
         throw new TRPCError({code:"BAD_REQUEST",message:"Something went wrong"})
       }
       else{
        throw new TRPCError({code:"TOO_MANY_REQUESTS",message:"you have no more points"})
       }
   }
      const createdMessage = await prisma.message.create({
            data : {
                chatId : existingChat.id,
                content : input.value,
                role : "user",
                parts: input.parts || [],
                attachments: input.attachments || [],
            }
       });
     return createdMessage;
     }),
});