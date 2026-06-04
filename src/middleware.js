import { NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // 1. Anti-cloning / anti-scraping logic: Block scraper bots, command line tools, and crawlers
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  
  const blockedAgents = [
    'httrack',          // Web site cloner
    'wget',             // CLI downloader
    'curl',             // CLI downloader
    'scrapy',           // Python scraping framework
    'headless',         // Headless browser identifier
    'selenium',         // Automated browser tool
    'puppeteer',        // Automated browser tool
    'playwright',       // Automated browser tool
    'python',           // Python requests/urllib
    'urllib',           // Python urllib
    'axios',            // JS HTTP client (often used in scripts)
    'node-fetch',       // JS HTTP client
    'go-http-client',   // Go HTTP library
    'postman',          // API client testing (often used to reverse engineer APIs)
    'java',             // Java HTTP clients
    'libwww',           // Perl/general web library
    'webcopy',          // Cyotek WebCopy cloner
    'teleport',         // Teleport Pro site cloner
    'offline explorer', // Offline Explorer site cloner
    'website extractor',// Website extractor cloner
    'site-sucker',      // SiteSucker macOS site cloner
    'sitesucker',       // SiteSucker macOS site cloner
    'ia_archiver',      // Archive.org crawler (optional, but prevents snapshot cloning)
    'gptbot',           // OpenAI bot
    'chatgpt-user',     // ChatGPT web crawler
    'claudebot',        // Anthropic Claude crawler
    'google-extended'   // Google AI training bot
  ];

  const isBlocked = blockedAgents.some(agent => userAgent.includes(agent));
  if (isBlocked) {
    return new NextResponse('Access Denied: Scraping, cloning, and automated bots are not allowed on this website.', { 
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  // 2. Protect administrative dashboard routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check if the service role key cookie exists and is valid
    const adminToken = request.cookies.get('admin_session_token')?.value;
    const serviceRoleKey = process.env.SUPABASE_KEY || '';
    const isValidToken = adminToken && serviceRoleKey && adminToken === serviceRoleKey;

    if (isValidToken) {
      return NextResponse.next();
    }

    const { user, response } = await updateSession(request);

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return response;
  }

  // 3. For public pages, we bypass updateSession to optimize speed and database limits
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (images folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
