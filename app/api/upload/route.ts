import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', userId);
    await mkdir(uploadDir, { recursive: true });
    
    // Save file
    const filePath = join(uploadDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Generate public URL
    const publicUrl = `/uploads/${userId}/${uniqueFilename}`;
    
    return NextResponse.json({
      success: true,
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        url: publicUrl,
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId,
        }
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate total size (50MB limit for multiple files)
    const maxTotalSize = 50 * 1024 * 1024; // 50MB
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      return NextResponse.json({ error: 'Total file size too large. Maximum is 50MB' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', userId);
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      // Validate individual file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        continue; // Skip files that are too large
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop() || '';
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      
      // Save file
      const filePath = join(uploadDir, uniqueFilename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      // Generate public URL
      const publicUrl = `/uploads/${userId}/${uniqueFilename}`;
      
      uploadedFiles.push({
        filename: uniqueFilename,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        url: publicUrl,
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId,
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      uploaded: uploadedFiles.length,
      total: files.length
    });
    
  } catch (error) {
    console.error('Multiple upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}