export async function GET() {
  const catalog = {
    "linkset": [
      {
        "anchor": "https://sdnegeribobong.sch.id/",
        "api-catalog": [
          {
            "href": "https://sdnegeribobong.sch.id/.well-known/api-catalog",
            "type": "application/linkset+json"
          }
        ],
        "service-doc": [
          {
            "href": "https://sdnegeribobong.sch.id/profil",
            "type": "text/html"
          }
        ],
        "agent-skills": [
          {
            "href": "https://sdnegeribobong.sch.id/.well-known/agent-skills/index.json",
            "type": "application/json"
          }
        ],
        "mcp-server-card": [
          {
            "href": "https://sdnegeribobong.sch.id/.well-known/mcp/server-card.json",
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
