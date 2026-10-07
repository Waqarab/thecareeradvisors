import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, requireSuperAdmin } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown-ip";
  const rl = await rateLimit.check(ip, "revalidate_1min", 30, 60 * 1000);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  await rateLimit.commit(ip, "revalidate_1min", 60 * 1000);

  // 1. Grab params and explicitly tell TypeScript they are strings
  const secret = request.nextUrl.searchParams.get('secret') as string | null;
  const tag = request.nextUrl.searchParams.get('tag') as string | null;
  const authHeader = request.headers.get("authorization");

  // 2. Validate Auth (Mode A or Mode B)
  const token = process.env.REVALIDATION_TOKEN;
  const isModeA =
    typeof token === "string" &&
    token.length > 0 &&
    (secret === token || authHeader === `Bearer ${token}`);
  
  if (!isModeA) {
    // Try Mode B (session cookie)
    const auth = await requireSuperAdmin(request);
    if (auth instanceof NextResponse) {
      // Both Mode A and Mode B failed
      return NextResponse.json({ message: 'Invalid token or unauthorized' }, { status: 401 });
    }
  }

  // 3. Validate Tag
  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
  }

  // 4. Revalidate
  revalidateTag(tag, 'max');
  
  return NextResponse.json({ revalidated: true, tag: tag, now: Date.now() });
}