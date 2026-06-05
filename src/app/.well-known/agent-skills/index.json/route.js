import { NextResponse } from 'next/server';

export async function GET() {
  const index = {
    "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    "skills": [
      {
        "name": "ppdb-online",
        "type": "skill-md",
        "description": "Mendaftarkan calon siswa baru (PPDB) secara online ke SD Negeri Bobong.",
        "url": "/agent-skills/ppdb-online/SKILL.md",
        "digest": "sha256:d8a24db90d7c07b66bbfbc44040da276632128e469502fb88a70928a6fcfef4f"
      }
    ]
  };

  return new Response(JSON.stringify(index), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    }
  });
}
