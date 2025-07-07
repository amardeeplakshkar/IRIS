import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';
import { tool } from 'ai';
import { z } from 'zod';

function extractYouTubeVideoId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
}

export const youtubeTranscription = tool({
    description: 'Transcribe the spoken content of a YouTube video',
    parameters: z.object({
        url: z.string().url().describe('The full YouTube video URL to transcribe'),
    }),
    execute: async function ({ url }) {
        try {
            const loader = YoutubeLoader.createFromUrl(url, {
                addVideoInfo: true,
                language: 'en',
            });

            const docs = await loader.load();

            const transcript = docs
                .map(doc => doc.pageContent)
                .join('\n')

            if (!transcript) {
                return { error: 'No transcript could be generated for this video.' };
            }

            const videoId = extractYouTubeVideoId(url);
            const embedLink = videoId
                ? `https://www.youtube.com/embed/${videoId}`
                : null;

            return {
                transcript,
                embedLink,
            };

        } catch (err: any) {
            console.error('YouTube transcription error:', err);
            return {
                error: `Something went wrong while transcribing "${url}". Please check the link and try again.`,
            };
        }
    },
});