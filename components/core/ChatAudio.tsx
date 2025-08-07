'use client'

import { Button } from '@/components/ui/button';
import { PauseIcon, PlayIcon, RefreshCcw, Volume2 } from 'lucide-react';
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import TooltipBox from '../helpers/TooltipBox';

const ChatAudio = ({ msg }: { msg: string }) => {
    const [audioFiles, setAudioFiles] = React.useState<any[]>([]);
    const [currentAudioIndex, setCurrentAudioIndex] = React.useState<number>(0);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
    const [isMerging, setIsMerging] = React.useState<boolean>(false);
    const [mergedAudioUrl, setMergedAudioUrl] = React.useState<string | null>(null);
    const [audioReady, setAudioReady] = React.useState<boolean>(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const mergedAudioRef = React.useRef<HTMLAudioElement>(null);


    const splitIntoParagraphs = (text: string): string[] => {
        return text?.split('\n\n')?.map(paragraph => paragraph.trim())?.filter(paragraph => paragraph.length > 0);
    };


    const generateTTSForParagraph = async (paragraph: string): Promise<any> => {
        const response = await fetch("/api/tts", {
            method: "POST",
            body: JSON.stringify({
                line: paragraph,
                voice: "alloy",
                emotion: "friendly, informative and little fast",
                use_random_seed: true,
                specific_seed: 3,
            }),
        });
        return await response.json();
    };


    const genAudio = async () => {
        setIsGenerating(true);
        setAudioFiles([]);
        setCurrentAudioIndex(0);
        setMergedAudioUrl(null);

        try {
            const paragraphs = splitIntoParagraphs(msg || '');
            const audioPromises = paragraphs.map(paragraph => generateTTSForParagraph(paragraph));
            const audioResults = await Promise.all(audioPromises);

            setAudioFiles(audioResults);


            await mergeAndPlayAudio(audioResults);
        } catch (error) {
            console.error('Error generating audio:', error);
        } finally {
            setIsGenerating(false);
        }
    };




    const handleAudioEnd = () => {
        const nextIndex = currentAudioIndex + 1;

        if (nextIndex < audioFiles.length) {
            setCurrentAudioIndex(nextIndex);
            if (audioRef.current) {
                audioRef.current.src = audioFiles[nextIndex]?.data[0]?.url;
                audioRef.current.play();
            }
        } else {
            setIsPlaying(false);
            setCurrentAudioIndex(0);
        }
    };




    const mergeAndPlayAudio = async (audioResults: any[]) => {
        setIsMerging(true);

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffers: AudioBuffer[] = [];


            for (const audioData of audioResults) {
                const response = await fetch(audioData.data[0].url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                audioBuffers.push(audioBuffer);
            }


            const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);


            const mergedBuffer = audioContext.createBuffer(
                audioBuffers[0].numberOfChannels,
                totalLength,
                audioBuffers[0].sampleRate
            );


            let offset = 0;
            for (const buffer of audioBuffers) {
                for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                    mergedBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
                }
                offset += buffer.length;
            }


            const length = mergedBuffer.length;
            const numberOfChannels = mergedBuffer.numberOfChannels;
            const sampleRate = mergedBuffer.sampleRate;


            const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
            const view = new DataView(arrayBuffer);


            const writeString = (offset: number, string: string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };

            writeString(0, 'RIFF');
            view.setUint32(4, 36 + length * numberOfChannels * 2, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, numberOfChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * numberOfChannels * 2, true);
            view.setUint16(32, numberOfChannels * 2, true);
            view.setUint16(34, 16, true);
            writeString(36, 'data');
            view.setUint32(40, length * numberOfChannels * 2, true);


            let offset2 = 44;
            for (let i = 0; i < length; i++) {
                for (let channel = 0; channel < numberOfChannels; channel++) {
                    const sample = Math.max(-1, Math.min(1, mergedBuffer.getChannelData(channel)[i]));
                    view.setInt16(offset2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                    offset2 += 2;
                }
            }

            const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            setMergedAudioUrl(url);


            setTimeout(() => {
                if (mergedAudioRef.current) {
                    mergedAudioRef.current.src = url;
                    setAudioReady(true);
                    mergedAudioRef.current.play().then(() => {
                        setIsPlaying(true);
                    }).catch(error => {
                        console.error('Auto-play failed:', error);
                        setIsPlaying(false);
                    });
                }
            }, 100);

        } catch (error) {
            console.error('Error merging audio files:', error);
        } finally {
            setIsMerging(false);
        }
    };


    const togglePlayPause = () => {
        if (!mergedAudioRef.current || !audioReady) return;

        if (isPlaying) {

            mergedAudioRef.current.pause();
            setIsPlaying(false);
        } else {

            mergedAudioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error('Play failed:', error);
                setIsPlaying(false);
            });
        }
    };


    const handleMergedAudioEnd = () => {
        setIsPlaying(false);
    };


    React.useEffect(() => {
        return () => {
            if (mergedAudioUrl) {
                URL.revokeObjectURL(mergedAudioUrl);
            }
        };
    }, [mergedAudioUrl]);

    return (
        <>
            <div>
                {!audioReady && <TooltipBox content={!isGenerating && !isMerging ? "Generate Audio" : "Loading Audio"}>
                    <Button variant="outline" size={'sm'} onClick={genAudio} disabled={isGenerating || isMerging}>
                        {isGenerating ?
                            <>
                                <RefreshCcw className="h-4 w-4 animate-spin" />
                            </>
                            : isMerging ?
                                <>
                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                </>
                                :
                                <Volume2 className="h-4 w-4" />
                        }
                    </Button>
                </TooltipBox>
                }

                {audioReady && (
                    <TooltipBox content={isPlaying ? "Pause Audio" : "Play Audio"}>
                        <Button onClick={togglePlayPause} variant="outline" size={'sm'}>
                            {isPlaying ?
                                <PauseIcon className="h-4 w-4" />
                                :
                                <PlayIcon className="h-4 w-4" />
                            }
                        </Button>
                    </TooltipBox>
                )}
            </div>
            {mergedAudioUrl && (
                <audio
                    ref={mergedAudioRef}
                    onEnded={handleMergedAudioEnd}
                    style={{ display: 'none' }}
                />
            )}
            <audio
                ref={audioRef}
                onEnded={handleAudioEnd}
                style={{ display: 'none' }}
            />
        </>
    )
}

export default ChatAudio