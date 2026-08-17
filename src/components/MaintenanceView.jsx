'use client';

export default function MaintenanceView({ schoolNpsn, operatorPhone }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
        <title>Pemeliharaan Sistem - SD Negeri Bobong</title>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-glow: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%);
            --secondary-glow: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(0,0,0,0) 70%);
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justifyContent: center;
            overflow-x: hidden;
            position: relative;
          }
          .aurora-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
          }
          .glow-1 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: var(--primary-glow);
            top: -10%;
            left: -10%;
            border-radius: 50%;
            animation: float-slow 20s infinite alternate;
          }
          .glow-2 {
            position: absolute;
            width: 600px;
            height: 600px;
            background: var(--secondary-glow);
            bottom: -10%;
            right: -10%;
            border-radius: 50%;
            animation: float-slow 25s infinite alternate-reverse;
          }
          @keyframes float-slow {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(50px, 30px) scale(1.1); }
            100% { transform: translate(-20px, -50px) scale(0.9); }
          }
          .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 24px 24px;
            z-index: 2;
            pointer-events: none;
          }
          .maintenance-card {
            position: relative;
            z-index: 10;
            width: 90%;
            max-width: 580px;
            padding: 3rem 2.5rem;
            background: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 
                        0 0 40px rgba(99, 102, 241, 0.05),
                        inset 0 0 1px rgba(255, 255, 255, 0.1);
            text-align: center;
            animation: scale-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes scale-up {
            0% { opacity: 0; transform: scale(0.95) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .logo-sec {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-bottom: 2rem;
          }
          .logo-img {
            width: 48px;
            height: 48px;
            object-fit: contain;
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
          }
          .logo-text {
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 2px;
            background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .icon-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 1.5rem;
          }
          .gear-icon {
            width: 80px;
            height: 80px;
            color: #f59e0b;
            filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.4));
            animation: spin-slow 12s infinite linear;
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .pulse-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90px;
            height: 90px;
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 50%;
            animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
          @keyframes pulse-ring {
            0% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
            80%, 100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
          }
          h1 {
            font-size: 2rem;
            margin: 0 0 0.75rem 0;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p.description {
            font-size: 1rem;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 2rem 0;
          }
          .btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 2rem;
          }
          @media (min-width: 480px) {
            .btn-group {
              flex-direction: row;
              justify-content: center;
            }
          }
          .btn {
            padding: 0.85rem 1.75rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            justifyContent: center;
            gap: 8px;
            text-decoration: none;
          }
          .btn-primary {
            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
            color: white;
            border: none;
            box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(79, 70, 229, 0.45);
            background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
          }
          .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .btn-secondary:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
            color: white;
          }
          .wa-btn {
            background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
          }
          .wa-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.35);
            background: linear-gradient(135deg, #4ade80 0%, #166534 100%);
          }
          .info-footer {
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            font-size: 0.85rem;
            color: #64748b;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }
          .info-footer a {
            color: #4f46e5;
            text-decoration: none;
            transition: color 0.2s;
          }
          .info-footer a:hover {
            color: #6366f1;
            text-decoration: underline;
          }
        `}} />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `
          document.cookie = "maintenance_mode=true; path=/; max-age=31536000; SameSite=Lax";
        `}} />
        <div className="aurora-bg">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
        </div>
        <div className="grid-overlay"></div>
        
        <div className="maintenance-card">
          <div className="logo-sec">
            <img src="/images/logo_sekolah.png" alt="Logo" className="logo-img" />
            <span className="logo-text">SD NEGERI BOBONG</span>
          </div>
          
          <div className="icon-wrapper">
            <div className="pulse-ring"></div>
            <svg className="gear-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1>Situs Sedang Pemeliharaan</h1>
          <p className="description">
            Kami sedang melakukan pemeliharaan sistem terencana untuk meningkatkan performa dan layanan website. Silakan coba beberapa saat lagi.
          </p>
          
          <div className="btn-group">
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Coba Lagi
            </button>
            
            <a href={`https://wa.me/${operatorPhone}?text=Halo%20SDN%20Bobong%20Operator,%20saya%20mengalami%20kendala%20saat%20mengakses%20website...`} target="_blank" rel="noopener noreferrer" className="btn wa-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.83.001-2.628-1.02-5.1-2.871-6.955C16.612 1.968 14.14 1.488 12.01 1.488c-5.439 0-9.862 4.41-9.866 9.833-.001 1.772.474 3.504 1.378 5.044l-.999 3.649 3.75-.98c1.516.822 3.011 1.258 4.774 1.258zm12.355-6.69c-.213-.107-1.262-.622-1.457-.7-.196-.077-.339-.115-.482.1s-.554.7-.68.855c-.125.154-.251.173-.464.066-.213-.107-.902-.332-1.717-1.06-.635-.675-1.064-1.51-1.189-1.725-.125-.215-.013-.331.093-.437.096-.095.213-.247.319-.371.107-.124.143-.213.214-.355.071-.142.036-.266-.018-.372s-.482-1.161-.661-1.59c-.174-.421-.344-.364-.482-.366-.125-.002-.268-.002-.411-.002s-.375.053-.571.253c-.196.2-.75.733-.75 1.787 0 1.054.768 2.071.875 2.214.107.142 1.511 2.307 3.661 3.235.512.221.911.353 1.222.452.514.163.982.14 1.352.085.412-.061 1.262-.515 1.439-1.011.178-.496.178-.921.125-1.011-.053-.089-.196-.142-.411-.249z"/>
            </svg>
          </a>
        </div>
        
        <div className="info-footer">
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <img src="/images/logo_sekolah.png" alt="Tiny logo" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover', display: 'inline-block', margin: 0, flexShrink: 0 }} />
            <span>NPSN: {schoolNpsn} • SD Negeri Bobong</span>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>
            Kembali ke <a href="/admin/login">Dashboard Admin</a>
          </div>
        </div>
      </div>
    </body>
  </html>
  );
}
