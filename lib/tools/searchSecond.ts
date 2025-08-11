import { tool } from 'ai'
import { z } from 'zod'
import { searchPrompt } from '../ai/prompts';

export const webSearchTool = tool({
    description: 'Use this tool when the user asks about recent events, current data, or anything the AI may not have reliable knowledge of. It performs a real-time web search using SearchGPT and returns a summarized answer in JSON format.',
    parameters: z.object({
        query: z
            .string()
            .describe('The user’s question or topic to search the web for—especially if it involves recent events, changing data, or unknown facts.'),
    }),
    execute: async function ({ query }) {
        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'sonar',
                  return_images: true,
                  messages: [
                    { role: 'system', content: searchPrompt },
                    { role: 'user', content: query },
                  ],
                  temperature: 0.2,
                  top_p: 0.9,
                  frequency_penalty: 1,
                  max_tokens: 1000,
                }),
              })
            
              const data = await response.json()
              return {
                content: data.choices[0].message.content,
                citations: data.citations || [],
                model: data.model,
                usage: data.usage,
                search_results: data.search_results,
              }
        } catch(error: any) {
        return {
            error: 'Something went wrong while performing the web search. Please try again later.',
            details: error?.message || error,
        };
    }
},
  });