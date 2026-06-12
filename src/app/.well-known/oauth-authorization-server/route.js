import { NextResponse } from 'next/server';

export async function GET(request) {
  const host = request.headers.get('host') || 'www.sdnegeribobong.sch.id';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;

  const oauthConfig = {
    "issuer": origin,
    "authorization_endpoint": `${origin}/admin/login`,
    "token_endpoint": `${origin}/api/auth`,
    "jwks_uri": `${origin}/.well-known/jwks.json`,
    "scopes_supported": ["admin"],
    "response_types_supported": ["code"],
    "token_endpoint_auth_methods_supported": ["client_secret_post"],
    "agent_auth": {
      "supported": false,
      "register_uri": null
    }
  };

  return new Response(JSON.stringify(oauthConfig), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    }
  });
}
