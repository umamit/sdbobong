'use client';

import { useState } from 'react';

export default function ContactClient({ initialFaqs, contacts = {} }) {
  const schoolEmail = contacts.email_sekolah || "admin@sdnegeribobong.sch.id";
  const operatorPhone = contacts.wa_operator ? `+${contacts.wa_operator}` : "+62 822-9211-1638";
  const operatorName = contacts.nama_operator || "Operator Humas";
  // FAQ accordion state: stores the ID of the currently expanded item, or null
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState({ type: '', text: '' }); // { type: 'success'|'error'|'loading', text: '' }

  const handleFaqToggle = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', text: 'Mengirim pesan Anda...' });

    // Simulate sending an email/message to school public relation
    setTimeout(() => {
      setFormStatus({
        type: 'success',
        text: `Terima kasih, ${name}! Pesan Anda tentang "${subject}" berhasil dikirim ke Humas SDN Bobong. Kami akan merespon melalui email (${email}) atau Whatsapp (${phone}) secepatnya.`
      });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: 'var(--space-md) var(--space-sm) var(--space-xl)' }}>
      
      {/* 1. FAQs Accordion Section */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <span className="welcome-badge">Ada Pertanyaan?</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}>Pertanyaan Sering Diajukan (FAQ)</h2>
        </div>

        {initialFaqs.length > 0 ? (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {initialFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="card-custom" 
                  style={{ 
                    padding: '0', 
                    overflow: 'hidden', 
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    transition: 'box-shadow 0.2s'
                  }}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => handleFaqToggle(faq.id)}
                    style={{
                      width: '100%',
                      padding: '16px var(--space-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '1rem',
                      color: 'var(--text-color)'
                    }}
                  >
                    <span>{faq.question}</span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary-color)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      ＋
                    </span>
                  </button>

                  {/* Accordion Content Body */}
                  <div 
                    style={{ 
                      maxHeight: isOpen ? '300px' : '0', 
                      overflow: 'hidden', 
                      transition: 'max-height 0.3s cubic-bezier(0, 1, 0, 1)',
                      borderTop: isOpen ? '1px solid var(--border-color)' : 'none',
                      backgroundColor: 'rgba(0, 0, 0, 0.01)'
                    }}
                  >
                    <div style={{ padding: 'var(--space-md)', fontSize: '0.95rem', color: '#555', lineHeight: '1.6' }}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>FAQ belum ditambahkan.</p>
        )}
      </section>

      {/* 2. Contact form & Map Grid */}
      <div className="grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
        
        {/* Left Column: Glassmorphic Contact Form */}
        <div className="card-custom" style={{ padding: 'var(--space-md)', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '4px' }}>Hubungi Humas Kami</h2>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 'var(--space-md)' }}>
            Kirim pertanyaan seputar PPDB, administrasi, kerjasama, atau kritik perbaikan secara langsung ke tim humas sekolah.
          </p>

          {formStatus.text && (
            <div 
              style={{ 
                padding: '12px', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: 'var(--space-md)',
                fontSize: '0.9rem',
                backgroundColor: formStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : formStatus.type === 'loading' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: formStatus.type === 'success' ? '#047857' : formStatus.type === 'loading' ? '#1d4ed8' : '#b91c1c',
                border: `1px solid ${formStatus.type === 'success' ? '#10b981' : formStatus.type === 'loading' ? '#3b82f6' : '#ef4444'}`
              }}
            >
              {formStatus.text}
            </div>
          )}

          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2px' }}>Nama Lengkap</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2px' }}>Email</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="alamat@email.com"
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2px' }}>No. HP/WA</label>
                <input
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxx"
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2px' }}>Subjek Pesan</label>
                <input
                  type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: PPDB"
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '2px' }}>Isi Pesan</label>
              <textarea
                required rows="3" value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik rincian pesan atau pertanyaan Anda di sini..."
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
              ></textarea>
            </div>

            <button
              type="submit" disabled={formStatus.type === 'loading'} className="btn-primary"
              style={{ width: '100%', padding: '10px', fontWeight: '600', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              {formStatus.type === 'loading' ? 'Mengirim...' : 'Kirim Pesan Hubungi'}
            </button>
          </form>
        </div>

        {/* Right Column: Google Maps & Physical Address Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Map Frame Card */}
          <div className="card-custom" style={{ padding: '8px', overflow: 'hidden', background: 'white' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.176463991275!2d124.476483!3d-1.74128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d0af4f3d1b11b5d%3A0xe5f99238c3866160!2sBobong%2C%20Taliabu%20Bar.%2C%20Kabupaten%20Pulau%20Taliabu%2C%20Maluku%20Utara!5e0!3m2!1sid!2sid!4v1780512345678!5m2!1sid!2sid"
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: 'var(--radius-sm)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Details Card */}
          <div className="card-custom" style={{ padding: 'var(--space-md)', background: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: 'var(--space-sm)' }}>Informasi Kontak</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <strong>Alamat Fisik Sekolah:</strong>
                  <p style={{ margin: 0, color: '#555' }}>Jalan Raya Bobong, Desa Bobong, Kecamatan Taliabu Barat, Kabupaten Pulau Taliabu, Provinsi Maluku Utara, Kode Pos 97791.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                <div>
                  <strong>Telepon / Whatsapp:</strong>
                  <p style={{ margin: 0, color: '#555' }}>{operatorPhone} ({operatorName})</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>✉️</span>
                <div>
                  <strong>Email Resmi:</strong>
                  <p style={{ margin: 0, color: '#555' }}>{schoolEmail}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
