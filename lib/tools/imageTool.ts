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
        size: z
            .enum(['256x256', '512x512', '1024x1024'])
            .default('512x512')
            .describe('Size of the generated image'),
        imageLink: z
            .string()
            .describe('Link to the image to be used as a reference'),
    }),
    execute: async ({ prompt, n, size, imageLink }) => {
        const [width, height] = size.split('x').map(Number);
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