import { NextResponse } from 'next/server';

export async function GET() {
  const card = {
    "$schema": "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    "name": "id.sch.sdnegeribobong/mcp-server",
    "version": "1.0.0",
    "protocolVersion": "2025-06-18",
    "description": "Model Context Protocol (MCP) server for SD Negeri Bobong, enabling AI agents to read news, teachers database, and register new students.",
    "serverInfo": {
      "name": "id.sch.sdnegeribobong/mcp-server",
      "version": "1.0.0",
      "description": "Model Context Protocol (MCP) server for SD Negeri Bobong"
    },
    "transport": {
      "type": "streamable-http",
      "endpoint": "/api/mcp"
    },
    "capabilities": {
      "tools": {
        "listChanged": false
      },
      "resources": {
        "subscribe": false
      }
    }
  };

  return new Response(JSON.stringify(card), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    }
  });
}
