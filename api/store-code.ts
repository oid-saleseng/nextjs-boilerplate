// app/api/store-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv'; // update path to your kv.ts file

export async function POST(req: NextRequest) {
  const { code, data } = await req.json();

  if (!code || !data) {
    return NextResponse.json({ error: 'Missing code or data' }, { status: 400 });
  }

  await kv.set(`auth-code:${code}`, data, { ex: 300 }); // expires in 5 minutes

  return NextResponse.json({ success: true });
}
