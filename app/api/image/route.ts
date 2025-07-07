// app/api/generate-image/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const prompt = searchParams.get('prompt') || 'A beautiful landscape';
  const seed = parseInt(searchParams.get('seed') || '42');
  const width = parseInt(searchParams.get('width') || '1024');
  const height = parseInt(searchParams.get('height') || '1024');
  const model = searchParams.get('model') || 'dall-e-2';

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_BASE_URL = process.env.IMAGE_BASE_URL as string;

  try {
    const apiResponse = await fetch(OPENAI_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        seed,
        width,
        height,
      }),
    });

    const result = await apiResponse.json();
    const base64 = await result.image;

    if (!base64) {
      return new NextResponse('Image generation failed', { status: 500 });
    }

    const imageBuffer = Buffer.from(base64, 'base64');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*', 
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
