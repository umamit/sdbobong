import { NextResponse } from 'next/server';

export async function GET() {
  const resourceMetadata = {
    "resource": "https://sdnegeribobong.sch.id",
    "authorization_servers": [
      "https://sdnegeribobong.sch.id"
    ],
    "scopes_supported": ["openid", "profile", "admin"],
    "bearer_methods_supported": ["header"],
    "resource_documentation": "https://sdnegeribobong.sch.id/auth.md"
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
