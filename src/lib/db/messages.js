import fs from 'fs';
import { supabase, isSupabaseEnabled, MESSAGES_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';

export async function loadMessages() {
  let localMessages = [];
  if (fs.existsSync(MESSAGES_JSON)) {
    try { localMessages = JSON.parse(fs.readFileSync(MESSAGES_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local messages:", e); }
  }
  if (!isSupabaseEnabled()) return localMessages;
  try {
    const { data: dbMessages, error } = await supabase.from("messages_sdn_bobong").select("*");
    if (!error && dbMessages) {
      const messagesSeeded = await isTableSeeded("messages");
      if (dbMessages.length === 0 && localMessages.length > 0 && !messagesSeeded) {
        for (const m of localMessages) {
          await supabase.from("messages_sdn_bobong").insert({ id: m.id, name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date });
        }
        await markTableSeeded("messages");
        return localMessages;
      }
      if (dbMessages.length > 0 && !messagesSeeded) await markTableSeeded("messages");
      const messagesList = dbMessages.map(m => ({ id: m.id, name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date }));
      try { fs.writeFileSync(MESSAGES_JSON, JSON.stringify(messagesList, null, 4), 'utf-8'); } catch (fsErr) {}
      return messagesList;
    }
  } catch (e) { console.error("Supabase loadMessages failed, falling back to local:", e.message || e); }
  return localMessages;
}

export async function saveMessages(messagesList) {
  let localSaved = false;
  try { fs.writeFileSync(MESSAGES_JSON, JSON.stringify(messagesList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving messages locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const m of messagesList) {
        const { error } = await supabase.from("messages_sdn_bobong").upsert({ id: m.id, name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date });
        if (error) throw error;
      }
      const localIds = new Set(messagesList.map(m => m.id));
      const { data: dbMessages, error: selectError } = await supabase.from("messages_sdn_bobong").select("id");
      if (!selectError && dbMessages) {
        for (const row of dbMessages) {
          if (!localIds.has(row.id)) await supabase.from("messages_sdn_bobong").delete().eq("id", row.id);
        }
      }
      return true;
    } catch (e) { console.error("Supabase saveMessages failed:", e.message || e); return localSaved; }
  }
  return localSaved;
}
