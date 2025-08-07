'use client';

import React from 'react';
import { MessagePart } from '@/lib/utils/attachments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ToolResultPartProps {
  part: MessagePart;
}

export function ToolResultPart({ part }: ToolResultPartProps) {
  const { type, content, url, metadata } = part;
  const toolName = metadata?.toolName || 'Unknown Tool';

  switch (type) {
    case 'tool_result_image':
      return (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Generated Image</CardTitle>
              <Badge variant="secondary">{toolName}</Badge>
            </div>
            {metadata?.prompt && (
              <p className="text-xs text-muted-foreground">
                Prompt: {metadata.prompt}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {url && (
              <div className="relative w-full max-w-md mx-auto">
                <Image
                  src={url}
                  alt={metadata?.prompt || 'Generated image'}
                  width={512}
                  height={512}
                  className="rounded-lg shadow-md"
                  unoptimized
                />
              </div>
            )}
          </CardContent>
        </Card>
      );

    case 'tool_result_artifact':
      try {
        const artifact = content ? JSON.parse(content) : null;
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Created Artifact</CardTitle>
                <Badge variant="secondary">{toolName}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {artifact && (
                <div className="space-y-2">
                  <div>
                    <strong>Title:</strong> {artifact.title}
                  </div>
                  <div>
                    <strong>Type:</strong> {artifact.type}
                  </div>
                  {artifact.template && (
                    <div>
                      <strong>Template:</strong> {artifact.template}
                    </div>
                  )}
                  <div>
                    <strong>ID:</strong> <code className="text-xs">{artifact.id}</code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      } catch (e) {
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Artifact Result</CardTitle>
                <Badge variant="secondary">{toolName}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {content}
              </pre>
            </CardContent>
          </Card>
        );
      }

    case 'tool_result_weather':
      try {
        const weatherData = content ? JSON.parse(content) : null;
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Weather Information</CardTitle>
                <Badge variant="secondary">{toolName}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(weatherData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        );
      } catch (e) {
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Weather Result</CardTitle>
                <Badge variant="secondary">{toolName}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {content}
              </pre>
            </CardContent>
          </Card>
        );
      }

    case 'tool_result_youtube':
      try {
        const youtubeData = content ? JSON.parse(content) : null;
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">YouTube Transcription</CardTitle>
                <Badge variant="secondary">{toolName}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(youtubeData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        );
      } catch (e) {
        return (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">YouTube Result</CardTitle>
                <Badge variant="secondary">{toolName}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {content}
              </pre>
            </CardContent>
          </Card>
        );
      }

    case 'tool_result_generic':
    default:
      return (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Tool Result</CardTitle>
              <Badge variant="secondary">{toolName}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {url && (
              <div className="mb-2">
                <strong>URL:</strong> <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
              </div>
            )}
            {content && (
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                {content}
              </pre>
            )}
            {metadata && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer text-muted-foreground">
                  View metadata
                </summary>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32 mt-1">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
  }
}