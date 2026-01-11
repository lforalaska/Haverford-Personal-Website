import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { regenerateSearchIndex } from '@/lib/search-index';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Regenerate search index
    await regenerateSearchIndex();

    // Revalidate all essay-related pages
    revalidatePath('/');
    revalidatePath('/essays');
    revalidatePath('/search');
    revalidatePath('/tags');

    return NextResponse.json({
      success: true,
      message: 'Site rebuilt successfully',
    });
  } catch (error) {
    console.error('Rebuild error:', error);
    return NextResponse.json(
      { success: false, message: 'Rebuild failed' },
      { status: 500 }
    );
  }
}
