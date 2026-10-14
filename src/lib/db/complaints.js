import fs from 'fs';
import { isSupabaseEnabled, invalidateChatKnowledge, DATA_DIR } from './core.js';
import { prisma } from '../prisma.js';
import path from 'path';

const COMPLAINTS_JSON = path.join(DATA_DIR, 'complaints.json');

export async function loadComplaints() {
  let localList = [];
  if (fs.existsSync(COMPLAINTS_JSON)) {
    try {
      localList = JSON.parse(fs.readFileSync(COMPLAINTS_JSON, 'utf-8'));
    } catch (e) {
      console.error("Error loading local complaints:", e);
    }
  }

  if (!isSupabaseEnabled()) return localList;

  try {
    const fromDb = await prisma.complaint.findMany({
      orderBy: { created_at: 'desc' }
    });
    if (fromDb) {
      try {
        fs.writeFileSync(COMPLAINTS_JSON, JSON.stringify(fromDb, null, 2), 'utf-8');
      } catch (e) {}
      return fromDb;
    }
  } catch (e) {
    console.error("Error loading complaints from Supabase via Prisma:", e.message || e);
  }

  return localList;
}

export async function saveComplaint(complaintData) {
  invalidateChatKnowledge();
  let localList = [];
  if (fs.existsSync(COMPLAINTS_JSON)) {
    try {
      localList = JSON.parse(fs.readFileSync(COMPLAINTS_JSON, 'utf-8'));
    } catch (e) {}
  }

  const existingIdx = localList.findIndex(c => c.id === complaintData.id || c.ticket_code === complaintData.ticket_code);
  if (existingIdx !== -1) {
    localList[existingIdx] = complaintData;
  } else {
    localList.unshift(complaintData);
  }

  try {
    fs.writeFileSync(COMPLAINTS_JSON, JSON.stringify(localList, null, 2), 'utf-8');
  } catch (e) {}

  if (isSupabaseEnabled()) {
    try {
      await prisma.complaint.upsert({
        where: { id: complaintData.id },
        update: {
          category: complaintData.category,
          message: complaintData.message,
          photo_url: complaintData.photo_url || null,
          is_anonymous: Boolean(complaintData.is_anonymous),
          reporter_name: complaintData.reporter_name || null,
          reporter_phone: complaintData.reporter_phone || null,
          status: complaintData.status || 'Menunggu',
          response: complaintData.response || null
        },
        create: {
          id: complaintData.id,
          ticket_code: complaintData.ticket_code,
          category: complaintData.category,
          message: complaintData.message,
          photo_url: complaintData.photo_url || null,
          is_anonymous: Boolean(complaintData.is_anonymous),
          reporter_name: complaintData.reporter_name || null,
          reporter_phone: complaintData.reporter_phone || null,
          status: complaintData.status || 'Menunggu',
          response: complaintData.response || null,
          created_at: complaintData.created_at
        }
      });
      return true;
    } catch (e) {
      console.error("Error saving complaint to Supabase via Prisma:", e.message || e);
    }
  }

  return true;
}

export async function deleteComplaint(complaintId) {
  invalidateChatKnowledge();
  let localList = [];
  if (fs.existsSync(COMPLAINTS_JSON)) {
    try {
      localList = JSON.parse(fs.readFileSync(COMPLAINTS_JSON, 'utf-8'));
    } catch (e) {}
  }

  localList = localList.filter(c => c.id !== complaintId && c.ticket_code !== complaintId);

  try {
    fs.writeFileSync(COMPLAINTS_JSON, JSON.stringify(localList, null, 2), 'utf-8');
  } catch (e) {}

  if (isSupabaseEnabled()) {
    try {
      await prisma.complaint.deleteMany({
        where: {
          OR: [
            { id: complaintId },
            { ticket_code: complaintId }
          ]
        }
      });
      return true;
    } catch (e) {
      console.error("Error deleting complaint from Supabase via Prisma:", e.message || e);
    }
  }

  return true;
}
