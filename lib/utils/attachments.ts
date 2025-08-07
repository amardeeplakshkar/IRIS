import { v4 as uuidv4 } from 'uuid';

export interface MessagePart {
  type: string;
  content?: string;
  url?: string;
  metadata?: any;
  order: number;
}

export interface MessageAttachment {
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  url: string;
  metadata?: any;
}

export interface ProcessedMessageData {
  parts: MessagePart[];
  attachments: MessageAttachment[];
}

/**
 * Process experimental attachments from AI SDK into parts and attachments
 */
export function processExperimentalAttachments(
  content: string,
  experimentalAttachments?: any[]
): ProcessedMessageData {
  const parts: MessagePart[] = [];
  const attachments: MessageAttachment[] = [];
  
  // Add text content as a part
  if (content) {
    parts.push({
      type: 'text',
      content: content,
      order: 0,
    });
  }
  
  // Process experimental_attachments
  if (experimentalAttachments && experimentalAttachments.length > 0) {
    experimentalAttachments.forEach((attachment: any, index: number) => {
      const filename = attachment.name || `attachment_${uuidv4()}`;
      const contentType = attachment.contentType || 'application/octet-stream';
      
      // Add image attachments as parts for display
      if (contentType.startsWith('image/')) {
        parts.push({
          type: 'image',
          url: attachment.url,
          metadata: {
            name: attachment.name,
            contentType: contentType,
            size: attachment.size,
          },
          order: index + 1,
        });
      }
      
      // Add file attachments as parts for text-based files
      if (isTextBasedFile(contentType, filename)) {
        try {
          const base64Data = attachment.url.split(',')[1];
          const textContent = atob(base64Data);
          parts.push({
            type: 'file',
            content: textContent,
            url: attachment.url,
            metadata: {
              name: attachment.name,
              contentType: contentType,
              size: attachment.size,
            },
            order: index + 1,
          });
        } catch (e) {
          // If we can't decode, just add as a file reference
          parts.push({
            type: 'file',
            url: attachment.url,
            metadata: {
              name: attachment.name,
              contentType: contentType,
              size: attachment.size,
              error: 'Could not decode content',
            },
            order: index + 1,
          });
        }
      }
      
      // Add as attachment regardless of type
      attachments.push({
        filename: filename,
        originalName: attachment.name || filename,
        contentType: contentType,
        size: attachment.size || 0,
        url: attachment.url,
        metadata: {
          experimental: true,
          originalAttachment: attachment,
        },
      });
    });
  }
  
  return { parts, attachments };
}

/**
 * Check if a file is text-based and can be processed as content
 */
export function isTextBasedFile(contentType: string, filename: string): boolean {
  // Check by content type
  if (contentType.startsWith('text/') ||
      contentType.includes('javascript') ||
      contentType.includes('json') ||
      contentType === 'application/pdf') {
    return true;
  }
  
  // Check by file extension
  const textExtensions = [
    'txt', 'md', 'py', 'js', 'ts', 'jsx', 'tsx', 
    'html', 'css', 'scss', 'yaml', 'yml', 'json', 
    'xml', 'csv', 'sql', 'sh', 'bat', 'ps1'
  ];
  
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? textExtensions.includes(extension) : false;
}

/**
 * Create a text representation of attachments for AI processing
 */
export function createAttachmentDescription(attachments: MessageAttachment[]): string {
  return attachments.map((attachment) => {
    if (attachment.contentType.startsWith('image/')) {
      return `[Image: ${attachment.originalName}]`;
    } else if (isTextBasedFile(attachment.contentType, attachment.originalName)) {
      // For text files, we should have the content in parts
      return `[File: ${attachment.originalName}]`;
    }
    return `[File: ${attachment.originalName}] (${attachment.contentType})`;
  }).join('\n\n');
}

/**
 * Validate file upload constraints
 */
export function validateFileUpload(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB` };
  }
  
  // Add more validation rules as needed
  const allowedTypes = [
    'image/', 'text/', 'application/json', 'application/pdf',
    'application/javascript', 'application/typescript'
  ];
  
  const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
  if (!isAllowedType) {
    // Check by extension as fallback
    const textExtensions = [
      'txt', 'md', 'py', 'js', 'ts', 'jsx', 'tsx', 
      'html', 'css', 'scss', 'yaml', 'yml', 'json', 
      'xml', 'csv', 'sql', 'sh', 'bat', 'ps1'
    ];
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !textExtensions.includes(extension)) {
      return { valid: false, error: 'File type not supported' };
    }
  }
  
  return { valid: true };
}

/**
 * Create parts from tool results for database storage
 */
export function createToolResultParts(toolResults: any[]): MessagePart[] {
  const parts: MessagePart[] = [];
  let partOrder = 0;
  
  for (const toolResult of toolResults) {
    const toolName = toolResult.toolName;
    const toolArgs = toolResult.args;
    const toolResultData = toolResult.result;
    
    switch (toolName) {
      case 'ImageTool':
        if (toolResultData.imageUrls && Array.isArray(toolResultData.imageUrls)) {
          toolResultData.imageUrls.forEach((imageUrl: string, index: number) => {
            parts.push({
              type: 'tool_result_image',
              url: imageUrl,
              metadata: {
                toolName: 'ImageTool',
                prompt: toolResultData.prompt,
                imageIndex: index,
                toolArgs: toolArgs,
                toolResult: toolResultData,
              },
              order: partOrder++,
            });
          });
        }
        break;
        
      case 'CreateArtifactTool':
        if (toolResultData.artifact) {
          parts.push({
            type: 'tool_result_artifact',
            content: JSON.stringify(toolResultData.artifact),
            metadata: {
              toolName: 'CreateArtifactTool',
              artifactId: toolResultData.artifact.id,
              artifactType: toolResultData.artifact.type,
              toolArgs: toolArgs,
              toolResult: toolResultData,
            },
            order: partOrder++,
          });
        }
        break;
        
      case 'displayWeather':
        parts.push({
          type: 'tool_result_weather',
          content: JSON.stringify(toolResultData),
          metadata: {
            toolName: 'displayWeather',
            toolArgs: toolArgs,
            toolResult: toolResultData,
          },
          order: partOrder++,
        });
        break;
        
      case 'youtubeTranscription':
        parts.push({
          type: 'tool_result_youtube',
          content: JSON.stringify(toolResultData),
          metadata: {
            toolName: 'youtubeTranscription',
            toolArgs: toolArgs,
            toolResult: toolResultData,
          },
          order: partOrder++,
        });
        break;
        
      default:
        // Generic tool result
        parts.push({
          type: 'tool_result_generic',
          content: JSON.stringify(toolResultData),
          metadata: {
            toolName: toolName,
            toolArgs: toolArgs,
            toolResult: toolResultData,
          },
          order: partOrder++,
        });
        break;
    }
  }
  
  return parts;
}

/**
 * Get tool result parts by type
 */
export function getToolResultPartsByType(parts: MessagePart[], toolName: string): MessagePart[] {
  return parts.filter(part =>
    part.type.startsWith('tool_result_') &&
    part.metadata?.toolName === toolName
  );
}

/**
 * Get all image parts (including tool results)
 */
export function getImageParts(parts: MessagePart[]): MessagePart[] {
  return parts.filter(part =>
    part.type === 'image' || part.type === 'tool_result_image'
  );
}

/**
 * Get all artifact parts
 */
export function getArtifactParts(parts: MessagePart[]): MessagePart[] {
  return parts.filter(part => part.type === 'tool_result_artifact');
}