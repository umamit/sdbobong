export async function GET(request) {
  const host = request.headers.get('host') || 'www.sdnegeribobong.sch.id';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;

  const catalog = {
    "linkset": [
      {
        "anchor": `${origin}/`,
        "api-catalog": [
          {
            "href": `${origin}/.well-known/api-catalog`,
            "type": "application/linkset+json"
          }
        ],
        "service-doc": [
          {
            "href": `${origin}/profil`,
            "type": "text/html"
          }
        ],
        "agent-skills": [
          {
            "href": `${origin}/.well-known/agent-skills/index.json`,
            "type": "application/json"
          }
        ],
        "mcp-server-card": [
          {
            "href": `${origin}/.well-known/mcp/server-card.json`,
            "type": "application/json"
          }
        ],
        "agent-card": [
          {
            "href": `${origin}/.well-known/agent-card.json`,
            "type": "application/json"
          }
        ],
        "openid-configuration": [
          {
            "href": `${origin}/.well-known/openid-configuration`,
            "type": "application/json"
          }
        ],
        "oauth-authorization-server": [
          {
            "href": `${origin}/.well-known/oauth-authorization-server`,
            "type": "application/json"
          }
        ],
        "oauth-protected-resource": [
          {
            "href": `${origin}/.well-known/oauth-protected-resource`,
            "type": "application/json"
          }
        ]
      }
    ]
  };

  return new Response(JSON.stringify(catalog), {
    status: 200,
    headers: {
      'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    }
  });
}
