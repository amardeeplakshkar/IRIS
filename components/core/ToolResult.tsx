'use client';

import { LoaderIcon } from 'lucide-react';
import { ToolInvocation } from 'ai';
import ImageDisplay from '../widgets/ImageDisplay';
import { TextShimmerWave } from '../ui/text-shimmer-wave';
import WeatherDisplay from '../widgets/WeatherDisplay';

interface ToolResultProps {
    isLoading: boolean;
    toolInvocation: ToolInvocation;
    id: string;
}

export function ToolResult({
    isLoading,
    toolInvocation,
    id
}: ToolResultProps) {
    const { toolName, toolCallId, state } = toolInvocation;
    const showResultText = ['displayWeather', 'webSearchTool', 'ImageTool', 'youtubeTranscription', 'cameraAiTool'].includes(toolName);
    const toolCallMessages: Record<string, string> = {
        displayWeather: 'Analysing Weather...',
        webSearchTool: 'Searching Web...',
        ImageTool: 'Generating Image...',
        youtubeTranscription: 'Analysing Video...',
        cameraAiTool: 'Analysing Video'
    }
    const toolResultMessage: Record<string, string> = {
        displayWeather: 'Weather Result',
        webSearchTool: 'Web Search Result',
        ImageTool: 'Image Generated',
        youtubeTranscription: 'Video Transcription Result',
        cameraAiTool: 'Camera AI Result'
    }
    const getToolResult = (toolName: string, toolInvocation: any) => {
        switch (toolName) {
            case 'displayWeather':
                if (toolInvocation?.result?.location?.name) {
                    return (
                        <WeatherDisplay isLoading={isLoading} data={toolInvocation?.result} />
                    );
                }
                return null;

            case 'youtubeTranscription':
                return (
                    <>
                        {
                            toolInvocation?.result?.embedLink &&
                            <iframe
                                src={toolInvocation?.result?.embedLink}
                                width="100%"
                                className='aspect-video max-h-[216px] rounded-lg max-w-[384px]'
                                height="100%"
                                allowFullScreen
                            ></iframe>
                        }
                    </>
                );

            case 'ImageTool':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                        {
                            toolInvocation?.result?.imageUrls &&
                            toolInvocation?.result?.imageUrls.map((imageUrl: string, index: number) => (
                                <>
                                <ImageDisplay
                                    key={index}
                                    src={imageUrl}
                                    prompt={toolInvocation?.result?.prompt}
                                    />
                                    </>
                            ))
                        }
                    </div>
                );

            default:
                return null;
        }
    };
    return (
        <div className="flex flex-col">
            {isLoading ? (
                <div className="flex flex-row gap-2 items-center">
                    {toolName === 'ImageTool' ? <></> : <>
                        <TextShimmerWave
                            className='[--base-color:#0D74CE] [--base-gradient-color:#5EB1EF]'
                            duration={1}
                            spread={1}
                            zDistance={1}
                            scaleDistance={1.1}
                            rotateYDistance={20}
                        >
                            {toolCallMessages[toolName]}
                        </TextShimmerWave>
                        <div className="animate-spin">
                            <LoaderIcon />
                        </div>
                    </>}
                </div>
            ) : (
                <div className="flex flex-row gap-2 items-center">
                    {toolName === 'ImageTool' ? <></> : <div className="font-medium">{toolResultMessage[toolName]}</div>}
                </div>
            )}

            {showResultText && (
                <div className="mb-2">
                    {getToolResult(toolName, toolInvocation)}
                </div>
            )}
        </div>
    );
}