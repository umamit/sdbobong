import { NextResponse } from 'next/server';

export async function GET() {
  const oauthConfig = {
    "issuer": "https://sdnegeribobong.sch.id",
    "authorization_endpoint": "https://sdnegeribobong.sch.id/admin/login",
    "token_endpoint": "https://sdnegeribobong.sch.id/api/auth",
    "jwks_uri": "https://sdnegeribobong.sch.id/.well-known/jwks.json",
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
