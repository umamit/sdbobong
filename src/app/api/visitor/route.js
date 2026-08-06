import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loadWebConfig, saveWebConfig } from '../../../lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = await loadWebConfig();
    const visitorCount = Math.max(config.stats?.visitor_count || 0, config.visitor_count || 0, 238);
    return NextResponse.json({ visitor_count: visitorCount });
  } catch (e) {
    console.error('Failed to get visitor count:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const hasVisited = cookieStore.get('has_visited')?.value;

    const config = await loadWebConfig();
    if (!config.stats) config.stats = {};
    
    let visitorCount = Math.max(config.stats.visitor_count || 0, config.visitor_count || 0, 238);

    // Only increment if user has not visited in this 1-hour session window
    if (hasVisited !== 'true') {
      visitorCount += 1;
      config.stats.visitor_count = visitorCount;
      config.visitor_count = visitorCount;
      
      const saved = await saveWebConfig(config);
      if (!saved) {
        console.error('Failed to save updated visitor count to database');
      }

      const response = NextResponse.json({ success: true, visitor_count: visitorCount, incremented: true });
      response.cookies.set('has_visited', 'true', {
        path: '/',
        maxAge: 60 * 60, // 1 hour session window instead of 365 days
        sameSite: 'lax',
        httpOnly: true
      });
      return response;
    }

    return NextResponse.json({ success: true, visitor_count: visitorCount, incremented: false });
  } catch (e) {
    console.error('Failed to update visitor count:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
