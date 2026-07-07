import fs from 'fs';
import { isSupabaseEnabled, MESSAGES_JSON } from './core.js';
import { isTableSeeded, markTableSeeded } from './config.js';
import { prisma } from '../prisma.js';

export async function loadMessages() {
  let localMessages = [];
  if (fs.existsSync(MESSAGES_JSON)) {
    try { localMessages = JSON.parse(fs.readFileSync(MESSAGES_JSON, 'utf-8')); }
    catch (e) { console.error("Error loading local messages:", e); }
  }
  if (!isSupabaseEnabled()) return localMessages;
  try {
    const dbMessages = await prisma.message.findMany();
    if (dbMessages) {
      const messagesSeeded = await isTableSeeded("messages");
      if (dbMessages.length === 0 && localMessages.length > 0 && !messagesSeeded) {
        for (const m of localMessages) {
          await prisma.message.create({
            data: { id: m.id, name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date }
          });
        }
        await markTableSeeded("messages");
        return localMessages;
      }
      if (dbMessages.length > 0 && !messagesSeeded) await markTableSeeded("messages");
      const messagesList = dbMessages.map(m => ({ id: m.id, name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date }));
      try { fs.writeFileSync(MESSAGES_JSON, JSON.stringify(messagesList, null, 4), 'utf-8'); } catch (fsErr) {}
      return messagesList;
    }
  } catch (e) { console.error("Supabase loadMessages failed via Prisma, falling back to local:", e.message || e); }
  return localMessages;
}

export async function saveMessages(messagesList) {
  let localSaved = false;
  try { fs.writeFileSync(MESSAGES_JSON, JSON.stringify(messagesList, null, 4), 'utf-8'); localSaved = true; }
  catch (e) { console.error("Error saving messages locally:", e); }
  if (isSupabaseEnabled()) {
    try {
      for (const m of messagesList) {
        await prisma.message.upsert({
          where: { id: m.id },
          update: { name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date },
          create: { id: m.id, name: m.name, role: m.role, type: m.type, message: m.message, status: m.status, date: m.date }
        });
      }
      const localIds = new Set(messagesList.map(m => m.id));
      const dbMessages = await prisma.message.findMany({ select: { id: true } });
      if (dbMessages) {
        for (const row of dbMessages) {
          if (!localIds.has(row.id)) {
            await prisma.message.delete({ where: { id: row.id } });
          }
        }
      }
      return true;
    } catch (e) { console.error("Supabase saveMessages failed via Prisma:", e.message || e); return localSaved; }
  }
  return localSaved;
}
