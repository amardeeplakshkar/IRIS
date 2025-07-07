import { myProvider } from "@/lib/ai/providers";
import { createDataStream, smoothStream, streamText } from "ai";
import { systemPrompt } from "@/lib/ai/prompts";
import { ImageTool } from "@/lib/tools/imageTool";
import { youtubeTranscription } from "@/lib/tools/youtubeTranscription";
import { displayWeather } from "@/lib/tools/weatherTool";

export const maxDuration = 60;

export async function POST(request: Request) {

  try {
    const { messages, selectedChatModel } =
      await request.json();

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt({ selectedChatModel }),
          messages,
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