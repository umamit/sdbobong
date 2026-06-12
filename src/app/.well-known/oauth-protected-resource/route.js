import { NextResponse } from 'next/server';

export async function GET(request) {
  const host = request.headers.get('host') || 'www.sdnegeribobong.sch.id';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;

  const resourceMetadata = {
    "resource": origin,
    "authorization_servers": [
      origin
    ],
    "scopes_supported": ["openid", "profile", "admin"],
    "bearer_methods_supported": ["header"],
    "resource_documentation": `${origin}/auth.md`
  };

  return new Response(JSON.stringify(resourceMetadata), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    }
  });
}
