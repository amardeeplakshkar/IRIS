import { tool } from 'ai';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { ArtifactType } from '@/components/provider/ArtifactProvider';

export const CreateArtifactTool = tool({
    description: 'Create an artifact to display in the sidebar',
    parameters: z.object({
        title: z
            .string()
            .min(1, 'Title is required')
            .describe('Title of the artifact'),
        type: z
            .enum(['image', 'mermaid', 'code', 'text'])
            .describe('Type of artifact to create'),
        template: z
            .string()
            .optional()
            .describe('Template for code artifact only like "react" or "node" or "html" or "python" etc'),
        content: z
            .string()
            .min(1, 'Content is required')
            .describe('Content of the artifact. For images, this should be a URL. For mermaid, this should be mermaid syntax. For code, this should be the code. For text, this should be the text.'),
        metadata: z
            .record(z.any())
            .optional()
            .describe('Additional metadata for the artifact'),
    }),
    execute: async function ({ title, type, template, content, metadata }) {
        try {
            // Generate a unique ID for the artifact
            const id = nanoid();
            
            // Create the artifact data
            const artifactData = {
                id,
                title,
                type: type as ArtifactType,
                template,
                content,
                metadata: metadata || {}
            };
    console.log(artifactData);            
            return {
                success: true,
                message: `Artifact "${title}" created successfully`,
                artifact: artifactData
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to create artifact: ${error.message || 'Unknown error'}`
            };
        }
    },
});