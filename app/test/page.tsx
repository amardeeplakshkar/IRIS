'use client';
import { ImageGeneration } from '@/components/ui/ai-chat-image-generation-1';
import { useState } from 'react';

export default function ImageGenerator() {
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const generateImage = async () => {
        setLoading(true);

        const prompt = 'A car in box';
        const seed = 123;
        const width = 1920;
        const height = 1080;
        const model = 'gpt-image-1';

        const query = new URLSearchParams({
            prompt,
            seed: seed.toString(),
            width: width.toString(),
            height: height.toString(),
            model,
        });

        const response = await fetch(`/api/image?${query.toString()}`);

        if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setImageUrl(objectUrl);
        } else {
            alert('Failed to generate image.');
        }

        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <button
                onClick={generateImage}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Image'}
            </button>
            <ImageGeneration>
                <img
                    className="aspect-video max-w-md object-cover"
                    src=""
                    alt="21st og generation"
                />
            </ImageGeneration>
            {imageUrl && (
                <div>
                    <p className="mb-2 text-sm text-gray-600">Generated Image:</p>
                    <img src={imageUrl} alt="Generated" className="rounded shadow-lg max-w-full" />
                </div>
            )}
        </div>
    );
}
