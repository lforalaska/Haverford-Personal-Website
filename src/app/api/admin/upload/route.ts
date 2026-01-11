import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { saveEssay, validateEssayData } from '@/lib/essay-upload';
import type { UploadResponse } from '@/types/upload';

export async function POST(request: NextRequest) {
  // Authentication check
  if (!isAuthenticated(request)) {
    return NextResponse.json<UploadResponse>(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const slug = formData.get('slug') as string;
    const tags = formData.get('tags') as string; // JSON array string
    const excerpt = formData.get('excerpt') as string;
    const draft = formData.get('draft') === 'true';

    // Validate required fields
    const validation = validateEssayData({
      file,
      title,
      date,
      slug,
      tags,
      excerpt,
      draft,
    });

    if (!validation.valid) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file!.text();

    // Parse tags
    const parsedTags = JSON.parse(tags);

    // Save essay
    const result = await saveEssay({
      title,
      date,
      slug,
      tags: parsedTags,
      excerpt,
      draft,
      content,
    });

    if (!result.success) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json<UploadResponse>({
      success: true,
      message: 'Essay uploaded successfully',
      slug: result.slug,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json<UploadResponse>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
