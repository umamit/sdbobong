'use client';

import { useEffect } from 'react';

export default function WebMcpShim({ allowCopy }) {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const tools = [
      {
        name: "search_school_info",
        description: "Mencari informasi profil sekolah, akademik, kesiswaan, tata tertib, dan PPDB di SD Negeri Bobong.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Kata kunci pencarian (misal: 'visi misi', 'ekstrakurikuler', 'jadwal belajar')"
            }
          },
          required: ["query"]
        },
        execute: async function(params) {
          try {
            const res = await fetch('/api/chat?message=' + encodeURIComponent("Cari informasi: " + params.query));
            const data = await res.json();
            return {
              content: [{ type: "text", text: data.reply || JSON.stringify(data) }]
            };
          } catch (err) {
            return {
              content: [{ type: "text", text: "Gagal mencari: " + err.message }]
            };
          }
        }
      },
      {
        name: "register_ppdb_student",
        description: "Mendaftarkan calon siswa baru secara online melalui PPDB Online SD Negeri Bobong.",
        inputSchema: {
          type: "object",
          properties: {
            nama_lengkap: { type: "string", description: "Nama lengkap calon siswa" },
            nik: { type: "string", description: "Nomor Induk Kependudukan (NIK) calon siswa (16 digit)" },
            tempat_lahir: { type: "string", description: "Tempat lahir calon siswa" },
            tanggal_lahir: { type: "string", description: "Tanggal lahir calon siswa (YYYY-MM-DD)" },
            jenis_kelamin: { type: "string", enum: ["Laki-laki", "Perempuan"], description: "Jenis kelamin" },
            alamat: { type: "string", description: "Alamat tempat tinggal lengkap" },
            nama_ibu: { type: "string", description: "Nama lengkap ibu kandung" },
            no_hp_orang_tua: { type: "string", description: "Nomor HP/WhatsApp orang tua yang aktif" }
          },
          required: ["nama_lengkap", "nik", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "alamat", "nama_ibu", "no_hp_orang_tua"]
        },
        execute: async function(params) {
          try {
            const res = await fetch('/api/ppdb', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(params)
            });
            const data = await res.json();
            return {
              content: [{ type: "text", text: data.message || JSON.stringify(data) }]
            };
          } catch (err) {
            return {
              content: [{ type: "text", text: "Gagal pendaftaran: " + err.message }]
            };
          }
        }
      }
    ];

    function setupShim() {
      if (typeof navigator !== 'undefined' && !navigator.modelContext) {
        navigator.modelContext = {
          _tools: [],
          registerTool: function(t, options) { this._tools.push({ tool: t, options: options }); },
          provideContext: function(c, options) { if(c && c.tools) { c.tools.forEach(t => this._tools.push({ tool: t, options: options })); } }
        };
      }
      if (typeof document !== 'undefined' && !document.modelContext) {
        document.modelContext = {
          _tools: [],
          registerTool: function(t, options) { this._tools.push({ tool: t, options: options }); },
          provideContext: function(c, options) { if(c && c.tools) { c.tools.forEach(t => this._tools.push({ tool: t, options: options })); } }
        };
      }
    }

    setupShim();

    const registeredContexts = new Set();

    function doRegister() {
      const contexts = [];
      if (typeof navigator !== 'undefined' && navigator.modelContext) contexts.push(navigator.modelContext);
      if (typeof document !== 'undefined' && document.modelContext) contexts.push(document.modelContext);
      if (typeof window !== 'undefined' && window.modelContext) contexts.push(window.modelContext);

      let newlyRegistered = false;
      contexts.forEach(function(ctx) {
        if (registeredContexts.has(ctx)) return;

        if (typeof ctx.registerTool === 'function') {
          tools.forEach(function(tool) {
            try {
              ctx.registerTool(tool, { signal: signal });
            } catch (e) {}
          });
          registeredContexts.add(ctx);
          newlyRegistered = true;
        }
        if (typeof ctx.provideContext === 'function') {
          try {
            ctx.provideContext({ tools: tools }, { signal: signal });
          } catch (e) {}
          registeredContexts.add(ctx);
          newlyRegistered = true;
        }
      });
      return newlyRegistered;
    }

    doRegister();

    let attempts = 0;
    const interval = setInterval(function() {
      attempts++;
      doRegister();
      if (attempts > 300) clearInterval(interval);
    }, 10);

    window.addEventListener('DOMContentLoaded', doRegister);
    window.addEventListener('load', doRegister);

    // Anti-cloning / copy keyboard shortcuts block
    const handleContextMenu = (e) => {
      if (!allowCopy) {
        const currentPath = window.location.pathname;
        const bypassPaths = ['/formulir-ppdb', '/ppdb/cetak', '/ppdb-online/sukses', '/ppdb/daftar/sukses', '/nilai', '/akademik/nilai'];
        if (currentPath.startsWith('/admin') || bypassPaths.includes(currentPath)) return;
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      if (!allowCopy) {
        const currentPath = window.location.pathname;
        const bypassPaths = ['/formulir-ppdb', '/ppdb/cetak', '/ppdb-online/sukses', '/ppdb/daftar/sukses', '/nilai', '/akademik/nilai'];
        if (currentPath.startsWith('/admin') || bypassPaths.includes(currentPath)) return;
        
        const isBypassedKey = ((e.ctrlKey || e.metaKey) && ['s', 'u', 'p', 'c'].includes(e.key.toLowerCase())) ||
                              (e.key === 'F12') ||
                              ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'c'].includes(e.key.toLowerCase()));
        if (isBypassedKey) {
          e.preventDefault();
        }
      }
    };

    const handleDragStart = (e) => {
      if (!allowCopy) {
        const currentPath = window.location.pathname;
        const bypassPaths = ['/formulir-ppdb', '/ppdb/cetak', '/ppdb-online/sukses', '/ppdb/daftar/sukses', '/nilai', '/akademik/nilai'];
        if (currentPath.startsWith('/admin') || bypassPaths.includes(currentPath)) return;
        if (e.target.nodeName === 'IMG') e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      controller.abort();
      clearInterval(interval);
      window.removeEventListener('DOMContentLoaded', doRegister);
      window.removeEventListener('load', doRegister);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [allowCopy]);

  return null;
}
