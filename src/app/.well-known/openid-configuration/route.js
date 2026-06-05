import { NextResponse } from 'next/server';

export async function GET() {
  const oidcConfig = {
    "issuer": "https://sdnegeribobong.sch.id",
    "authorization_endpoint": "https://sdnegeribobong.sch.id/admin/login",
    "token_endpoint": "https://sdnegeribobong.sch.id/api/auth",
    "jwks_uri": "https://sdnegeribobong.sch.id/.well-known/jwks.json",
    "scopes_supported": ["openid", "profile"],
    "response_types_supported": ["code"],
    "subject_types_supported": ["public"],
    "id_token_signing_alg_values_supported": ["HS256"],
    "token_endpoint_auth_methods_supported": ["client_secret_post"],
    "claims_supported": ["iss", "sub", "aud", "exp", "iat"],
    "registration_endpoint": null
  };

  return new Response(JSON.stringify(oidcConfig), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    }
  });
}
