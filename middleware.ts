// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.carrentalsgo.com',
  'https://www.nationfirstchoice.com',
];

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const response = NextResponse.next();

  // ✅ Apply CORS headers globally
  response.headers.set(
    'Access-Control-Allow-Origin',
    isAllowedOrigin ? origin : allowedOrigins[0]
  );
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // ✅ Handle OPTIONS preflight request globally
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

// ✅ Apply middleware only to API routes
export const config = {
  matcher: ['/api/:path*'],
};
