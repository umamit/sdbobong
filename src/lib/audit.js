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

/**
 * Safely purges all audit logs, keeping only one entry.
 */
export async function purgeAuditLogs(actionDetails = "Pembersihan log audit dilakukan oleh Administrator.", request = null) {
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

  const singlePurgeLog = {
    id,
    timestamp,
    username,
    action: 'SECURITY_PURGE_LOGS',
    details: actionDetails,
    ip,
    userAgent
  };

  // 1. Save locally
  try {
    fs.writeFileSync(AUDIT_LOGS_JSON, JSON.stringify([singlePurgeLog], null, 4), 'utf-8');
  } catch (e) {
    console.error("Error writing purge log locally:", e);
  }

  // 2. Sync to Supabase if active
  if (isSupabaseEnabled()) {
    try {
      // First delete all existing logs
      await supabase.from("audit_logs_sdn_bobong").delete().neq("id", "none");
      
      // Then insert the purge log
      await supabase.from("audit_logs_sdn_bobong").insert({
        id: singlePurgeLog.id,
        timestamp: singlePurgeLog.timestamp,
        username: singlePurgeLog.username,
        action: singlePurgeLog.action,
        details: singlePurgeLog.details,
        ip: singlePurgeLog.ip,
        user_agent: singlePurgeLog.userAgent
      });
    } catch (e) {
      console.error("Supabase purgeAuditLogs failed:", e.message || e);
    }
  }

  return [singlePurgeLog];
}

/**
 * Prunes audit logs older than a given number of days.
 */
export async function pruneAuditLogs(days) {
  if (!days || days <= 0) return 0;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffTime = cutoffDate.getTime();

  // 1. Prune local logs
  let logs = [];
  if (fs.existsSync(AUDIT_LOGS_JSON)) {
    try {
      logs = JSON.parse(fs.readFileSync(AUDIT_LOGS_JSON, 'utf-8'));
    } catch (e) {}
  }

  const originalLength = logs.length;
  logs = logs.filter(log => {
    const logTime = new Date(log.timestamp).getTime();
    return logTime >= cutoffTime;
  });

  const prunedCount = originalLength - logs.length;
  if (prunedCount > 0) {
    try {
      fs.writeFileSync(AUDIT_LOGS_JSON, JSON.stringify(logs, null, 4), 'utf-8');
    } catch (e) {}
  }

  // 2. Prune Supabase logs
  if (isSupabaseEnabled()) {
    try {
      const isoCutoff = cutoffDate.toISOString();
      await supabase
        .from("audit_logs_sdn_bobong")
        .delete()
        .lt("timestamp", isoCutoff);
    } catch (e) {
      console.error("Supabase pruneAuditLogs failed:", e);
    }
  }

  return prunedCount;
}

