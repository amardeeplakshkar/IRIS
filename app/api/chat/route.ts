import { myProvider } from "@/lib/ai/providers";
import { createDataStream, smoothStream, streamText } from "ai";
import { systemPrompt } from "@/lib/ai/prompts";
import { ImageTool } from "@/lib/tools/imageTool";
import { youtubeTranscription } from "@/lib/tools/youtubeTranscription";
import { displayWeather } from "@/lib/tools/weatherTool";
import { CreateArtifactTool } from "@/lib/tools/artifactTool";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {

  try {
    const { messages, selectedChatModel } =
      await request.json();

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

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages: processedMessages,
          maxSteps: 5,
          toolChoice: 'auto',
          experimental_activeTools: (() => {
            if (selectedChatModel === 'chat-model-reasoning' || selectedChatModel === 'search-model') {
              return [];
            }
            
            const tools: ('ImageTool' | 'displayWeather' | 'youtubeTranscription' | 'CreateArtifactTool')[] = [
              'ImageTool',
              'displayWeather',
              'youtubeTranscription',
              'CreateArtifactTool'
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
            CreateArtifactTool
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