'use client';

import { useState, useEffect, useRef } from 'react';

export default function RichTextEditor({ defaultValue = '', placeholder = 'Tuliskan isi berita di sini...', onChange }) {
  const [html, setHtml] = useState(defaultValue);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);

  // Initialize defaultValue
  useEffect(() => {
    if (defaultValue && editorRef.current && editorRef.current.innerHTML !== defaultValue) {
      editorRef.current.innerHTML = defaultValue;
      setHtml(defaultValue);
    }
  }, [defaultValue]);

  // Listen to native input event for external dispatching (like AI draft application)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleNativeInput = () => {
      const currentHtml = editor.innerHTML;
      const normalizedHtml = currentHtml === '<break>' || currentHtml === '<br>' ? '' : currentHtml;
      setHtml(normalizedHtml);
    };

    editor.addEventListener('input', handleNativeInput);
    return () => {
      editor.removeEventListener('input', handleNativeInput);
    };
  }, []);

  // Save the current selection range before losing focus to modal input
  const saveSelection = () => {
    if (typeof window !== 'undefined') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
  };

  // Restore selection range to make formatting commands apply correctly
  const restoreSelection = () => {
    if (typeof window !== 'undefined' && savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Modern helper: query inline format state via Selection API
  // Falls back to execCommand state for block-level queries (justify)
  const queryFormatState = (command) => {
    if (typeof document === 'undefined') return false;
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return false;

      // Use Selection API for inline formats
      if (command === 'bold') {
        const el = sel.anchorNode?.parentElement;
        if (el) {
          const fw = window.getComputedStyle(el).fontWeight;
          return fw === 'bold' || parseInt(fw, 10) >= 700 ||
            !!el.closest('b,strong') ||
            !!el.closest('[style*="font-weight: bold"]') ||
            !!el.closest('[style*="font-weight:bold"]');
        }
      }
      if (command === 'italic') {
        const el = sel.anchorNode?.parentElement;
        if (el) {
          return window.getComputedStyle(el).fontStyle === 'italic' ||
            !!el.closest('i,em');
        }
      }
      if (command === 'underline') {
        const el = sel.anchorNode?.parentElement;
        if (el) {
          return window.getComputedStyle(el).textDecorationLine?.includes('underline') ||
            !!el.closest('u');
        }
      }
      // Block-level alignment — still use execCommand state (no native API alternative)
      // eslint-disable-next-line no-undef
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  const executeCommand = (command, value = null) => {
    if (typeof document === 'undefined') return;
    try {
      // execCommand is deprecated but remains the only cross-browser
      // way to apply rich-text formatting to contentEditable elements.
      // Browsers have committed to keeping it functional for this use case.
      // See: https://github.com/w3c/editing/blob/gh-pages/docs/execCommand.md
      document.execCommand(command, false, value);
    } catch (err) {
      console.warn(`[RichTextEditor] execCommand('${command}') failed:`, err);
    }
    updateActiveFormats();
    handleContentChange();

    // Maintain focus back to editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      // If it is just empty tags, normalize to empty string
      const normalizedHtml = currentHtml === '<break>' || currentHtml === '<br>' ? '' : currentHtml;
      setHtml(normalizedHtml);
      if (onChange) {
        onChange(normalizedHtml);
      }
    }
  };

  const updateActiveFormats = () => {
    if (typeof document === 'undefined') return;
    setActiveFormats({
      bold: queryFormatState('bold'),
      italic: queryFormatState('italic'),
      underline: queryFormatState('underline'),
      justifyLeft: queryFormatState('justifyLeft'),
      justifyCenter: queryFormatState('justifyCenter'),
      justifyRight: queryFormatState('justifyRight'),
      justifyFull: queryFormatState('justifyFull'),
    });
  };

  const handleLinkButtonClick = () => {
    saveSelection();
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleSaveLink = (e) => {
    e.preventDefault();
    setShowLinkModal(false);
    
    let url = linkUrl.trim();
    if (!url) return;

    // Add https:// protocol if not present
    if (!/^https?:\/\//i.test(url) && !/^\//.test(url)) {
      url = 'https://' + url;
    }

    restoreSelection();
    
    // Apply link formatting
    executeCommand('createLink', url);
  };

  const handleHeadingChange = (e) => {
    const value = e.target.value;
    if (value) {
      executeCommand('formatBlock', value);
      // Reset select dropdown
      e.target.value = '';
    }
  };

  return (
    <div className="rich-text-editor-container" style={{
      border: '1px solid var(--border-color, #cbd5e1)',
      borderRadius: 'var(--radius-md, 8px)',
      backgroundColor: 'var(--bg-card, #ffffff)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '500px',
      position: 'relative',
      boxShadow: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
      transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)'
    }}>
      
      {/* TOOLBAR */}
      <div className="editor-toolbar" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        padding: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-color, #cbd5e1)',
        alignItems: 'center',
        zIndex: 5
      }}>
        
        {/* Text Formats */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className={`toolbar-btn ${activeFormats.bold ? 'active' : ''}`}
          title="Tebal (Ctrl+B)"
          style={getButtonStyle(activeFormats.bold)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className={`toolbar-btn ${activeFormats.italic ? 'active' : ''}`}
          title="Miring (Ctrl+I)"
          style={getButtonStyle(activeFormats.italic)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="20"/><line x1="14" y1="4" x2="5" y2="20"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className={`toolbar-btn ${activeFormats.underline ? 'active' : ''}`}
          title="Garis Bawah (Ctrl+U)"
          style={getButtonStyle(activeFormats.underline)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </button>

        <div className="toolbar-separator" style={separatorStyle}></div>

        {/* Headings Dropdown */}
        <select
          onChange={handleHeadingChange}
          defaultValue=""
          className="toolbar-select"
          title="Format Paragraf / Judul"
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-color, #cbd5e1)',
            backgroundColor: 'var(--bg-main, #ffffff)',
            color: 'var(--text-main, #1e293b)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            height: '28px',
            outline: 'none',
            minWidth: '120px'
          }}
        >
          <option value="" disabled>Format...</option>
          <option value="<p>">Paragraf Biasa</option>
          <option value="<h3>">Judul Sedang (H3)</option>
          <option value="<h4>">Judul Kecil (H4)</option>
        </select>

        <div className="toolbar-separator" style={separatorStyle}></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="toolbar-btn"
          title="Daftar Poin"
          style={getButtonStyle(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="toolbar-btn"
          title="Daftar Angka"
          style={getButtonStyle(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6H2v4h2M4 14H2v2h2v2H2"/></svg>
        </button>

        <div className="toolbar-separator" style={separatorStyle}></div>

        {/* Alignment */}
        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className={`toolbar-btn ${activeFormats.justifyLeft ? 'active' : ''}`}
          title="Rata Kiri"
          style={getButtonStyle(activeFormats.justifyLeft)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className={`toolbar-btn ${activeFormats.justifyCenter ? 'active' : ''}`}
          title="Rata Tengah"
          style={getButtonStyle(activeFormats.justifyCenter)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className={`toolbar-btn ${activeFormats.justifyRight ? 'active' : ''}`}
          title="Rata Kanan"
          style={getButtonStyle(activeFormats.justifyRight)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyFull')}
          className={`toolbar-btn ${activeFormats.justifyFull ? 'active' : ''}`}
          title="Rata Kiri & Kanan (Justify)"
          style={getButtonStyle(activeFormats.justifyFull)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
        </button>

        <div className="toolbar-separator" style={separatorStyle}></div>

        {/* Link & Clear */}
        <button
          type="button"
          onClick={handleLinkButtonClick}
          className="toolbar-btn"
          title="Sisipkan Tautan"
          style={getButtonStyle(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="toolbar-btn"
          title="Bersihkan Format"
          style={getButtonStyle(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

      </div>

      {/* EDITABLE WORKSPACE */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        style={{
          flex: 1,
          padding: '16px',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'var(--text-main, #1e293b)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          minHeight: '420px',
          overflowY: 'auto'
        }}
        data-placeholder={placeholder}
        className="editor-workspace"
      />

      {/* Hidden Textarea for Form bindings */}
      <textarea
        name="content"
        id="news_content"
        value={html}
        onChange={() => {}}
        required
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      {/* Custom Styles Injection */}
      <style jsx global>{`
        .editor-workspace:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          font-style: italic;
          pointer-events: none;
          display: block;
        }
        
        .editor-workspace h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary-dark, #0b3c5d);
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .editor-workspace h4 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--primary-dark, #0b3c5d);
          margin-top: 0.85rem;
          margin-bottom: 0.4rem;
        }

        .editor-workspace p {
          margin-bottom: 0.75rem;
        }

        .editor-workspace ul, .editor-workspace ol {
          padding-left: 24px;
          margin-bottom: 0.75rem;
        }

        .editor-workspace ul {
          list-style-type: disc;
        }

        .editor-workspace ol {
          list-style-type: decimal;
        }

        .editor-workspace a {
          color: var(--primary, #3b82f6);
          text-decoration: underline;
          cursor: pointer;
        }

        /* Responsive and Dark theme adaptations */
        .dark-mode .editor-workspace h3,
        .dark-mode .editor-workspace h4 {
          color: #ffffff;
        }

        .toolbar-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toolbar-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* ELEGANT POPUP MODAL FOR INSERT LINK */}
      {showLinkModal && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <form onSubmit={handleSaveLink} style={{
            background: 'var(--bg-main, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '12px',
            padding: '20px',
            width: '90%',
            maxWidth: '360px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main, #0f172a)' }}>🔗 Sisipkan Tautan Web</h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '1.2rem',
                  color: 'var(--text-muted, #64748b)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                &times;
              </button>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: '1.4' }}>
              Masukkan alamat web (URL) tujuan. Contoh: <code>sdnegeribobong.sch.id</code> atau <code>kemdikbud.go.id</code>.
            </p>

            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://contoh-link.com"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color, #cbd5e1)',
                backgroundColor: 'var(--bg-card, #ffffff)',
                color: 'var(--text-main, #0f172a)',
                fontSize: '0.85rem',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}
            />

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  background: 'transparent',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-main, #64748b)'
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--primary, #3b82f6)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                }}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const separatorStyle = {
  width: '1px',
  height: '18px',
  backgroundColor: 'var(--border-color, #cbd5e1)',
  margin: '0 4px',
  alignSelf: 'center'
};

const getButtonStyle = (isActive) => ({
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: isActive ? '1px solid var(--primary, #3b82f6)' : '1px solid transparent',
  borderRadius: '4px',
  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
  color: isActive ? 'var(--primary, #3b82f6)' : 'var(--text-muted, #64748b)',
  cursor: 'pointer',
  padding: 0,
  outline: 'none'
});
