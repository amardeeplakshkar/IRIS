import { myProvider } from "@/lib/ai/providers";
import { createDataStream, smoothStream, streamText } from "ai";
import { systemPrompt } from "@/lib/ai/prompts";
import { ImageTool } from "@/lib/tools/imageTool";
import { youtubeTranscription } from "@/lib/tools/youtubeTranscription";
import { displayWeather } from "@/lib/tools/weatherTool";
import { CreateArtifactTool } from "@/lib/tools/artifactTool";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { google } from '@ai-sdk/google';
import prisma from "@/lib/db";
import { auth } from '@clerk/nextjs/server';
import { processExperimentalAttachments } from "@/lib/utils/attachments";
import { webSearchTool } from "@/lib/tools/searchSecond";
export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Get authentication
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages, selectedChatModel, chatId } =
      await request.json();

    // Verify chat exists and belongs to user
    const existingChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        clerkId: userId,
      },
    });

    if (!existingChat) {
      return new Response('Chat not found', { status: 404 });
    }

    // Save user message to database (last message should be from user)
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      try {
        // Process parts and attachments using utility function
        const { parts, attachments } = processExperimentalAttachments(
          lastMessage.content,
          lastMessage.experimental_attachments
        );

        // Create parts array for user message in the expected format
        const userParts: Array<{
          type: string;
          text?: string;
          content?: string;
          url?: string;
          metadata?: any;
          order: number;
        }> = [];

        // Add any existing parts from the message
        if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
          lastMessage.parts.forEach((part: any, index: number) => {
            userParts.push({
              type: part.type || 'text',
              text: part.text || part.content,
              content: part.content,
              url: part.url,
              metadata: part.metadata,
              order: index + 1,
            });
          });
        }

        await prisma.message.create({
          data: {
            chatId: chatId,
            content: lastMessage.content,
            role: 'user',
            parts: userParts,
            attachments: lastMessage.experimental_attachments || [],
          },
        });
      } catch (error) {
        console.error('Error saving user message:', error);
        return new Response('Error saving message to database', { status: 500 });
      }
    }

      let hasNonImageAttachments = false;
      for (const message of messages) {
        if (message.experimental_attachments) {
          for (const attachment of message.experimental_attachments) {
            if (!attachment.contentType?.startsWith('image/')) {
              hasNonImageAttachments = true;
              break;
            }
          }
          if (hasNonImageAttachments) break;
        }
      }

    // Process messages to handle attachments
    const processedMessages = messages.map((message: any) => {
      if (message.experimental_attachments) {
        // Convert attachments to a format the AI can understand
        const attachmentDescriptions = message.experimental_attachments.map((attachment: any) => {
          if (attachment.contentType?.startsWith('image/')) {
            return `[Image: ${attachment.name}]`;
          } else if (attachment.contentType?.startsWith('text/') ||
                     attachment.contentType?.includes('javascript') ||
                     attachment.contentType?.includes('json') ||
                     attachment.contentType === 'application/pdf' ||
                     attachment.name?.match(/\.(txt|md|py|js|ts|jsx|tsx|html|css|scss|yaml|yml|json|xml)$/i)) {
            // For text files, decode and include content
            try {
              const base64Data = attachment.url.split(',')[1];
              const textContent = atob(base64Data);
              return `[File: ${attachment.name}]\n\`\`\`\n${textContent}\n\`\`\``;
            } catch (e) {
              return `[File: ${attachment.name}] (content could not be read)`;
            }
          }
          return `[File: ${attachment.name}] (${attachment.contentType})`;
        }).join('\n\n');

        return {
          ...message,
          content: message.content + (attachmentDescriptions ? '\n\n' + attachmentDescriptions : ''),
          experimental_attachments: message.experimental_attachments
        };
      }
      return message;
    });

    let assistantResponse = '';

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages: processedMessages,
          maxSteps: 5,
          toolChoice: 'auto',
          experimental_activeTools: (() => {
            if (selectedChatModel === 'chat-model-reasoning') {
              return [];
            }
            
            const tools: ('ImageTool' | 'displayWeather' | 'youtubeTranscription' | 'CreateArtifactTool' | 'webSearchTool')[] = [
              'ImageTool',
              'displayWeather',
              'youtubeTranscription',
              'CreateArtifactTool',
              'webSearchTool'
            ];
            
            if (selectedChatModel === 'artifact-model') {
              tools.push('CreateArtifactTool');
            }
            
            return tools;
          })(),
          tools: {
            ImageTool,
            displayWeather,
            youtubeTranscription,
            CreateArtifactTool,
            webSearchTool
          },
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('Stream error:', error);
        return 'Oops, an error occurred!';
      },
    });


    return new Response(stream);
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return new Response('Unauthorized', { status: 401 });
      }
      if (error.message.includes('not found')) {
        return new Response('Chat not found', { status: 404 });
      }
    }
    
    return new Response('Internal server error', { status: 500 });
  }
}