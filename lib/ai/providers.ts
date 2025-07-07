import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { createOpenAI } from "@ai-sdk/openai"
import {
    customProvider,
    extractReasoningMiddleware,
    wrapLanguageModel,
} from "ai"
const openai = createOpenAICompatible({
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
    name: "azure-openai",
    headers: {
        "api-key": process.env.OPENAI_API_KEY!,
        "api-version": "2023-06-01-preview",
        "api-base": process.env.OPENAI_BASE_URL!,
    },
})
const image = createOpenAI({
    baseURL: process.env.IMAGE_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
    name: "azure-openai",
    headers: {
        "api-key": process.env.OPENAI_API_KEY!,
        "api-version": "2023-06-01-preview",
        "api-base": process.env.IMAGE_BASE_URL!,
    },
})

export const myProvider = customProvider({
    languageModels: {
        'chat-model': openai('openai'),
        'search-model': openai('searchgpt'),
        'chat-model-deepresearch': openai('openai-reasoning'),
        'chat-model-reasoning': wrapLanguageModel({
            model: openai('deepseek-reasoning'),
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('openai'),
        'artifact-model': openai('openai'),
    },
    imageModels: {
        'image-model': image.image('gpt-image-1'),
    },
});