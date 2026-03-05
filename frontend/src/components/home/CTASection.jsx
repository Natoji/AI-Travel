// src/components/home/CTASection.jsx
import { Link } from 'react-router-dom'

export default function CTASection({ user }) {
  return (
    <section style={{ padding: '100px 32px' }}>
      <div className="cta-box" style={{ maxWidth: 1200, margin: '0 auto', background: '#0f172a', borderRadius: 40, padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '2px solid #334155' }}>
        <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'rgba(99,102,241,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, background: 'rgba(168,85,247,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, color: 'white', fontWeight: 300, marginBottom: 24 }}>
            Bắt đầu hành trình của bạn<br />
            <em style={{ color: '#a5b4fc', fontStyle: 'italic' }}>ngay hôm nay</em>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Tham gia cùng hàng ngàn người dùng đang tận hưởng những chuyến đi được tối ưu bởi trí tuệ nhân tạo.
          </p>
          <Link to={user ? '/dashboard' : '/register'} className="btn-primary" style={{ background: 'white', color: '#0f172a' }}>
            Tạo lịch trình miễn phí ngay →
          </Link>
        </div>
      </div>
    </section>
  )
}