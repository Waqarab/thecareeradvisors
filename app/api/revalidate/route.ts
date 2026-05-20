import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Grab params and explicitly tell TypeScript they are strings
  const secret = request.nextUrl.searchParams.get('secret') as string | null;
  const tag = request.nextUrl.searchParams.get('tag') as string | null;

  // 2. Validate Secret
  if (secret !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // 3. Validate Tag
  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
  }

  // 4. Revalidate
  revalidateTag(tag, 'max');
  
  return NextResponse.json({ revalidated: true, tag: tag, now: Date.now() });
}