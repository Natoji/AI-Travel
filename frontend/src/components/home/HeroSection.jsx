// src/components/home/HeroSection.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedBackground from './AnimatedBackground'

const previewImageModules = import.meta.glob('../../assets/home-preview/*.{jpg,jpeg,png,webp,svg}', { eager: true, import: 'default' })
const previewImages = Object.values(previewImageModules)

export default function HeroSection({ user }) {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)

  useEffect(() => {
    if (previewImages.length <= 1) return
    const timer = setInterval(() => {
      setActivePreviewIndex((prev) => (prev + 1) % previewImages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero-bg">
      <div className="hero-bg-pattern" />
      <AnimatedBackground />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 2 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 80, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div className="badge"><span>✨</span> Trải nghiệm du lịch kỷ nguyên AI</div>
            <h1 className="hero-title">
              Du lịch thông minh<br />
              với <em>trợ lý AI</em><br />
              của riêng bạn
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6, marginBottom: 44, maxWidth: 540 }}>
              Lên kế hoạch cho chuyến đi mơ ước chỉ trong vài giây. Chính xác, tiết kiệm và hoàn toàn miễn phí.
            </p>
            <div className="btn-group" style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
              <Link to={user ? '/dashboard' : '/register'} className="btn-primary">
                Bắt đầu miễn phí →
              </Link>
              {!user && (
                <Link to="/login" style={{ padding: '16px 32px', borderRadius: 14, textDecoration: 'none', color: '#0f172a', fontWeight: 600, border: '2px solid #e2e8f0', display: 'inline-block', background: 'rgba(255,255,255,0.8)' }}>
                  Đăng nhập
                </Link>
              )}
            </div>
            <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { value: '30s', label: 'Lập lịch trình' },
                { value: '+120', label: 'Điểm đến VN' },
                { value: '24/7', label: 'Hỗ trợ tức thì' },
              ].map((s, i) => (
                <div key={i} className="hero-stat">
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Preview */}
          <div className="preview-card-container" style={{ position: 'relative' }}>
            <div className="floating-label" style={{ top: -20, left: -20, animationDelay: '0s' }}>
              <span style={{ fontSize: 20 }}>🧭</span> Lộ trình thông minh
            </div>
            <div className="floating-label" style={{ bottom: 20, right: -30, animationDelay: '1s' }}>
              <span style={{ fontSize: 20 }}>💎</span> Tiết kiệm chi phí
            </div>
            <div className="preview-card">
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '16/11', background: '#f8fafc' }}>
                {previewImages.length > 0 ? (
                  previewImages.map((src, index) => (
                    <img key={index} src={src} alt="Travel"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: index === activePreviewIndex ? 1 : 0, transition: 'opacity 0.8s ease' }} />
                  ))
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', gap: 12 }}>
                    <div style={{ fontSize: 64 }}>✈️</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#6366f1' }}>AI Travel Planner</div>
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>Thêm ảnh vào src/assets/home-preview/</div>
                  </div>
                )}
                {previewImages.length > 1 && (
                  <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                    {previewImages.map((_, i) => (
                      <div key={i} onClick={() => setActivePreviewIndex(i)}
                        style={{ width: i === activePreviewIndex ? 20 : 8, height: 8, borderRadius: 999, background: i === activePreviewIndex ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s', cursor: 'pointer' }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}