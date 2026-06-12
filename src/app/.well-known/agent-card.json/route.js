import { NextResponse } from 'next/server';

export async function GET(request) {
  const host = request.headers.get('host') || 'www.sdnegeribobong.sch.id';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;

  const card = {
    "name": "Aim AI",
    "description": "Asisten chatbot resmi SD Negeri Bobong yang membantu menjawab pertanyaan tentang profil sekolah, akademik, PPDB online, kesiswaan, dan tata tertib.",
    "version": "1.0.0",
    "protocolVersion": "0.3.0",
    "url": origin,
    "supportedInterfaces": [
      {
        "url": `${origin}/api/chat`,
        "protocolBinding": "HTTP+JSON",
        "protocolVersion": "1.0"
      }
    ],
    "skills": [
      {
        "id": "tanya_jawab_sekolah",
        "name": "Tanya Jawab Informasi Sekolah",
        "description": "Menjawab pertanyaan seputar jadwal sekolah, tata tertib, persyaratan PPDB, ekstrakurikuler, dan visi misi.",
        "tags": ["sekolah", "bobong", "ppdb", "akademik"],
        "examples": ["Kapan pendaftaran PPDB dibuka?", "Apa saja ekstrakurikuler di SDN Bobong?"]
      }
    ],
    "capabilities": {
      "streaming": true,
      "pushNotifications": false,
      "stateTransitionHistory": false
    },
    "defaultInputModes": ["text/plain"],
    "defaultOutputModes": ["text/plain"]
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
