import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma  from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
export const chatRouter = createTRPCRouter({
  getOne : protectedProcedure
   .input(z.object({
     id:z.string().min(1, {message:"Id is requierd"}),
   }))
  .query(async ({input,ctx})=>{
    const existingchat= await prisma.chat.findUnique({
     where:{
        id :input.id,
        clerkId:ctx.auth.userId,
      },

    });
      if (!existingchat){
         throw new TRPCError({code:"NOT_FOUND",message: "Chat not found"})
      }
       return existingchat;
  }),
  getMany : protectedProcedure
  .query(async ({ ctx })=>{
    const chats= await prisma.chat.findMany({
     where :{
             clerkId : ctx.auth.userId,
     },
     include : {
      messages : true,
     },
      orderBy:{
        updatedAt :"desc",
      },
    });
       return chats;
  }),
  create : protectedProcedure
     .input(
        z.object({
            value : z.string().min(1,{message: "Value is required"})
        })
     )
     .mutation(async ({input, ctx})=>{
      try{
        // await consumeCredits();
      }
     catch (err){
         if(err instanceof Error){
           throw new TRPCError({code:"BAD_REQUEST",message:"Something went wrong"})
         }
         else{
          throw new TRPCError({code:"TOO_MANY_REQUESTS",message:"you have no more points"})
         }
     }

      // Ensure user exists in database
      const user = await prisma.user.upsert({
        where: { clerkId: ctx.auth.userId! },
        update: {},
        create: {
          clerkId: ctx.auth.userId!,
          email: ctx.auth.sessionClaims?.email as string || "",
          name: ctx.auth.sessionClaims?.name as string || "User",
        },
      });

      const createdChat = await prisma.chat.create({
        data : {
          clerkId: ctx.auth.userId!,
          messages :{
            create:{
            content : input.value,
            role : "user",
          }
        }
      }
        });
     return createdChat
     }),
});