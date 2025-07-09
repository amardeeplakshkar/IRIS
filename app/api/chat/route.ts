import { myProvider } from "@/lib/ai/providers";
import { createDataStream, smoothStream, streamText } from "ai";
import { systemPrompt } from "@/lib/ai/prompts";
import { ImageTool } from "@/lib/tools/imageTool";
import { youtubeTranscription } from "@/lib/tools/youtubeTranscription";
import { displayWeather } from "@/lib/tools/weatherTool";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {

  try {
    const { messages, selectedChatModel } =
      await request.json();

    // Check if there are any non-image attachments
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

    const processedMessages = await Promise.all(messages.map(async (message: any) => {
      if (message.experimental_attachments) {
        const attachmentDescriptions = await Promise.all(message.experimental_attachments.map(async (attachment: any) => {
          if (attachment.contentType?.startsWith('image/')) {
            return `[Image: ${attachment.name}]`;
          } else if (attachment.contentType?.startsWith('text/') ||
                     attachment.contentType?.includes('javascript') ||
                     attachment.contentType?.includes('json') ||
                     attachment.contentType === 'application/pdf' ||
                     attachment.name?.match(/\.(txt|md|py|js|ts|jsx|tsx|html|css|scss|yaml|yml|json|xml|pdf)$/i)) {
            try {
              let textContent: string;
              
              if (attachment.url.startsWith('blob:')) {
                const response = await fetch(attachment.url);
                textContent = await response.text();
              } else if (attachment.url.startsWith('data:')) {
                const base64Data = attachment.url.split(',')[1];
                textContent = atob(base64Data);
              } else {
                throw new Error('Unsupported URL format');
              }
              
              return `[File: ${attachment.name}]\n\`\`\`\n${textContent}\n\`\`\``;
            } catch (e) {
              return `[File: ${attachment.name}] (content could not be read)`;
            }
          }
          return `[File: ${attachment.name}] (${attachment.contentType})`;
        }));
        
        const attachmentDescriptionsText = attachmentDescriptions.join('\n\n');

        return {
          ...message,
          content: message.content + (attachmentDescriptionsText ? '\n\n' + attachmentDescriptionsText : ''),
          experimental_attachments: message.experimental_attachments
        };
      }
      return message;
    }));

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: hasNonImageAttachments
            ? openrouter('google/gemma-3-27b-it:free')
            : myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages: processedMessages,
          maxSteps: 5,
          toolChoice: 'auto',
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning' || selectedChatModel === 'search-model'
              ? []
              : [
                'ImageTool',
                'displayWeather',
                'youtubeTranscription'
              ],
          tools: {
            ImageTool,
            displayWeather,
            youtubeTranscription
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
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });


    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Oops, an error occurred!', { status: 500 });
  }
}