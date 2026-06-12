import { NextResponse } from 'next/server';

export async function GET(request) {
  const host = request.headers.get('host') || 'www.sdnegeribobong.sch.id';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;

  const oidcConfig = {
    "issuer": origin,
    "authorization_endpoint": `${origin}/admin/login`,
    "token_endpoint": `${origin}/api/auth`,
    "jwks_uri": `${origin}/.well-known/jwks.json`,
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
