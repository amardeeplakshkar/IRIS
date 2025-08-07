'use server'

import prisma from "@/lib/db";

export const saveAssistantResponse = async (chatId: string, assistantResponse: string, parts: any) => {
  await prisma.message.create({
    data: {
      chatId: chatId,
      content: assistantResponse,
      role: 'assistant',
      parts: parts
    },
  });
}