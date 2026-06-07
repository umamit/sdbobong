import fs from 'fs';
import path from 'path';
import { isSupabaseEnabled, supabase } from './database';

const BUNDLED_DATA_DIR = path.join(process.cwd(), 'data');
const AUDIT_LOGS_JSON = path.join(BUNDLED_DATA_DIR, 'audit_logs.json');

// Ensure data folder exists
try {
  if (!fs.existsSync(BUNDLED_DATA_DIR)) {
    fs.mkdirSync(BUNDLED_DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error("Error creating data dir for audit logs:", err);
}

/**
 * Loads audit logs from either local JSON or Supabase.
 */
export async function loadAuditLogs() {
  let localLogs = [];
  if (fs.existsSync(AUDIT_LOGS_JSON)) {
    try {
      localLogs = JSON.parse(fs.readFileSync(AUDIT_LOGS_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local audit logs:", e);
    }
  }

  if (!isSupabaseEnabled()) return localLogs;

  try {
    const { data: dbLogs, error } = await supabase
      .from("audit_logs_sdn_bobong")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(500); // Safety cap
    
    if (!error && dbLogs) {
      const mappedLogs = dbLogs.map(l => ({
        id: l.id,
        timestamp: l.timestamp,
        username: l.username,
        action: l.action,
        details: l.details,
        ip: l.ip,
        userAgent: l.user_agent || l.userAgent
      }));

      // Cache locally
      try {
        fs.writeFileSync(AUDIT_LOGS_JSON, JSON.stringify(mappedLogs, null, 4), 'utf-8');
      } catch (e) {}

      return mappedLogs;
    }
  } catch (e) {
    console.error("Supabase loadAuditLogs failed, falling back to local:", e.message || e);
  }

  return localLogs;
}

/**
 * Saves audit logs list.
 */
export async function saveAuditLogs(logsList) {
  let localSaved = false;
  try {
    fs.writeFileSync(AUDIT_LOGS_JSON, JSON.stringify(logsList, null, 4), 'utf-8');
    localSaved = true;
  } catch (e) {
    console.error("Error saving audit logs locally:", e);
  }

  if (isSupabaseEnabled()) {
    try {
      // Upsert latest 50 logs for fast sync
      const latestLogs = logsList.slice(0, 50);
      for (const l of latestLogs) {
        await supabase.from("audit_logs_sdn_bobong").upsert({
          id: l.id,
          timestamp: l.timestamp,
          username: l.username,
          action: l.action,
          details: l.details,
          ip: l.ip,
          user_agent: l.userAgent
        });
      }
      return true;
    } catch (e) {
      console.error("Supabase saveAuditLogs failed:", e.message || e);
      return localSaved;
    }
  }
  return localSaved;
}

/**
 * Extracts and cleans the client's IP address from a request object.
 * Resolves NextRequest.ip, standard headers, and raw sockets.
 */
export function getClientIp(request) {
  if (!request) return '127.0.0.1';
  
  let ip = '';
  
  // 1. Try standard NextRequest.ip (supplied by NextJS / Vercel router)
  if (request.ip) {
    ip = request.ip;
  }
  
  // 2. Try headers (if request has standard Header Map or plain object)
  if (!ip) {
    if (typeof request.headers?.get === 'function') {
      ip = request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           request.headers.get('x-client-ip');
    } else if (request.headers) {
      ip = request.headers['x-forwarded-for'] || 
           request.headers['x-real-ip'] || 
           request.headers['x-client-ip'];
    }
  }
  
  // 3. Fallback to raw socket / connection properties if available (Node.js dev environment)
  if (!ip) {
    ip = request.socket?.remoteAddress || 
         request.connection?.remoteAddress || 
         request.req?.socket?.remoteAddress || 
         '127.0.0.1';
  }
  
  // 4. Clean up the IP address
  // If x-forwarded-for contains multiple proxy IPs (comma-separated), take the first one
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  
  // Clean IPv6-mapped IPv4 addresses like ::ffff:192.168.1.5 -> 192.168.1.5
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  // Standardize IPv6 loopback to IPv4 loopback for cleaner view if appropriate
  if (ip === '::1') {
    ip = '127.0.0.1';
  }
  
  return ip || '127.0.0.1';
}

/**
 * Creates and writes a new audit log record.
 * Compatible with standard NextJS request objects.
 */
export async function createAuditLog(action, details, request) {
  try {
    const ip = getClientIp(request);
    let userAgent = "Unknown Device";
    
    if (request) {
      if (typeof request.headers?.get === 'function') {
        userAgent = request.headers.get('user-agent') || 'Unknown Device';
      } else if (request.headers) {
        userAgent = request.headers['user-agent'] || 'Unknown Device';
      }
    }

    const username = "Admin SDN Bobong";
    const timestamp = new Date().toISOString();
    const id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newLog = {
      id,
      timestamp,
      username,
      action,
      details,
      ip,
      userAgent
    };

    const logs = await loadAuditLogs();
    logs.unshift(newLog);

    // Keep max 1000 logs locally
    if (logs.length > 1000) {
      logs.splice(1000);
    }

    await saveAuditLogs(logs);
    return newLog;
  } catch (err) {
    console.error("Failed to create audit log:", err);
    return null;
  }
}
