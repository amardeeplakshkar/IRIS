import { tool } from 'ai';
import { z } from 'zod';

export const ImageTool = tool({
    description: 'Generate one or more images based on a given prompt',
    parameters: z.object({
        prompt: z
            .string()
            .min(5, 'Prompt should be descriptive (at least 5 characters)')
            .describe('A detailed prompt for image generation'),
        n: z
            .number()
            .min(1)
            .max(4)
            .default(1)
            .describe('Number of images to generate (1–4)'),
        ratio: z
            .enum(['16:9', '1:1', '4:3', '9:16', '3:4', '5:3', '3:5'])
            .default('1:1')
            .describe('Ratio of the generated image'),
        imageLink: z
            .string()
            .describe('Link to the image to be used as a reference'),
    }),
    execute: async ({ prompt, n, ratio, imageLink }) => {
        const maxSize = 1024;

        const [wRatio, hRatio] = ratio.split(':').map(Number);
    
        let width, height;
    
        if (wRatio >= hRatio) {
            width = maxSize;
            height = Math.round((maxSize * hRatio) / wRatio);
        } else {
            height = maxSize;
            width = Math.round((maxSize * wRatio) / hRatio);
        }
    
        const imageUrls = [];

        for (let i = 0; i < n; i++) {
            // const imageUrl = `https://iris.amardeep.space/api/image?prompt=${encodeURIComponent(prompt)}&seed=${Math.floor(Math.random() * 1000)}&width=${width}&height=${height}&model=gpt-image-1`;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${Math.floor(Math.random() * 1000)}&width=${width}&height=${height}&image=${imageLink}&model=kontext&token=${process.env.OPENAI_API_KEY}`;
            imageUrls.push(imageUrl);
        }

        return {
            prompt,
            message: 'Images generated successfully',
            imageUrls,
            imageLink
        };
    },
});