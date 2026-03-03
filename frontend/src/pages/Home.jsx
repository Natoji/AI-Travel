import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '🤖', title: 'AI thông minh', desc: 'Gemini AI tạo lịch trình chi tiết theo từng giờ dựa trên sở thích cá nhân.' },
  { icon: '⚡', title: 'Chỉ 30 giây', desc: 'Tiết kiệm hàng giờ tìm kiếm, có ngay lịch trình hoàn chỉnh cực nhanh.' },
  { icon: '✏️', title: 'Tùy chỉnh tự do', desc: 'Dễ dàng thay đổi điểm đến, thêm bớt hoạt động và lưu lại hành trình.' },
  { icon: '💰', title: 'Tối ưu ngân sách', desc: 'Dự toán chi tiết chi phí đi lại, ăn uống và tham quan cho cả chuyến đi.' },
]

const destinations = [
  { name: 'Đà Nẵng', emoji: '🌊', tag: 'Biển & Cầu Rồng', color: '#e0f2fe' },
  { name: 'Hội An', emoji: '🏮', tag: 'Phố cổ lung linh', color: '#ffedd5' },
  { name: 'Phú Quốc', emoji: '🌴', tag: 'Đảo ngọc thiên đường', color: '#dcfce7' },
  { name: 'Sapa', emoji: '🏔️', tag: 'Núi rừng hùng vĩ', color: '#f1f5f9' },
  { name: 'Hà Nội', emoji: '🏛️', tag: 'Văn hóa & Thủ đô', color: '#fee2e2' },
  { name: 'Ninh Bình', emoji: '🛶', tag: 'Tràng An thơ mộng', color: '#f5f3ff' },
]

const techStack = [
  { name: 'Gemini AI', desc: 'Trí tuệ nhân tạo', icon: '🤖', color: '#fef9c3', border: '#fde68a', tag: 'Google' },
  { name: 'React', desc: 'Giao diện người dùng', icon: '⚛️', color: '#e0f2fe', border: '#bae6fd', tag: 'Meta' },
  { name: 'FastAPI', desc: 'Backend API', icon: '⚡', color: '#dcfce7', border: '#bbf7d0', tag: 'Python' },
  { name: 'SQLite', desc: 'Cơ sở dữ liệu', icon: '🗄️', color: '#f0f4ff', border: '#c7d2fe', tag: 'Database' },
  { name: 'Tailwind CSS', desc: 'Giao diện hiện đại', icon: '🎨', color: '#f0fdfa', border: '#99f6e4', tag: 'CSS' },
  { name: 'JWT Auth', desc: 'Bảo mật xác thực', icon: '🔐', color: '#fdf2f8', border: '#f0abfc', tag: 'Security' },
]

const previewImageModules = import.meta.glob('../assets/home-preview/*.{jpg,jpeg,png,webp,svg}', { eager: true, import: 'default' })
const previewImages = Object.values(previewImageModules)

export default function Home() {
  const { user } = useAuth()
  const [activePreviewIndex, setActivePreviewIndex] = useState(0)

  useEffect(() => {
    if (previewImages.length <= 1) return
    const timer = setInterval(() => {
      setActivePreviewIndex((prev) => (prev + 1) % previewImages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0f172a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        .hero-bg {
          background: linear-gradient(135deg, #f8faff 0%, #ffffff 40%, #fdfaff 100%);
          min-height: 95vh; position: relative; overflow: hidden;
          display: flex; align-items: center;
        }
        .hero-bg::before {
          content: ''; position: absolute;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
          top: -200px; right: -100px; filter: blur(50px); z-index: 0;
        }
        .hero-bg-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.12) 1px, transparent 0);
          background-size: 32px 32px; z-index: 0;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #4f46e5; padding: 8px 16px;
          border-radius: 999px; font-size: 14px; font-weight: 600;
          border: 2px solid #e0e7ff;
          box-shadow: 0 4px 12px rgba(99,102,241,0.05); margin-bottom: 24px;
        }
        .hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(36px, 5.5vw, 72px);
          font-weight: 300; line-height: 1.05;
          margin-bottom: 24px; letter-spacing: -1.5px;
        }
        .hero-title em {
          font-style: italic;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          font-weight: 600;
        }
        .btn-primary {
          background: #0f172a; color: white;
          padding: 16px 36px; border-radius: 14px;
          font-size: 16px; font-weight: 600;
          text-decoration: none; transition: all 0.3s;
          box-shadow: 0 10px 25px rgba(15,23,42,0.15);
          display: inline-block;
        }
        .btn-primary:hover { transform: translateY(-3px); background: #1e293b; box-shadow: 0 15px 35px rgba(15,23,42,0.25); }
        .preview-card {
          background: white; border-radius: 28px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
          padding: 12px; border: 1px solid rgba(0,0,0,0.03);
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .preview-card:hover { transform: translateY(-10px) rotate(1deg); }
        .floating-label {
          position: absolute; background: white;
          padding: 12px 20px; border-radius: 18px;
          border: 2px solid #f1f5f9;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          font-weight: 700; font-size: 14px;
          display: flex; align-items: center; gap: 10px;
          z-index: 10; animation: float 5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .hero-stat {
          background: white; border: 2px solid #e2e8f0;
          padding: 20px; border-radius: 20px; transition: all 0.3s;
        }
        .hero-stat:hover { border-color: #6366f1; box-shadow: 0 10px 20px rgba(99,102,241,0.05); }
        .feature-card {
          background: white; border-radius: 24px;
          padding: 32px; border: 2px solid #e2e8f0; transition: all 0.4s;
        }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.04); border-color: #6366f1; }
        .dest-card {
          display: flex; align-items: center; gap: 16px;
          background: white; padding: 16px; border-radius: 20px;
          border: 2px solid #e2e8f0; transition: all 0.3s; cursor: pointer;
        }
        .dest-card:hover { transform: scale(1.03); border-color: #6366f1; }
        .section-divider { border: 0; height: 1px; background: #e2e8f0; margin: 0 auto; max-width: 1280px; }
        .step-card { border-radius: 24px; padding: 36px 28px; transition: all 0.3s; }
        .step-card:hover { transform: translateY(-6px); }
        .tech-card { border-radius: 20px; padding: 24px 20px; text-align: center; transition: all 0.3s; cursor: default; }
        .tech-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .compare-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; }

        /* ── RESPONSIVE MOBILE ── */
        @media (max-width: 768px) {
          .hero-bg { min-height: auto !important; padding: 60px 0 !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .preview-card-container { display: none !important; }
          .hero-stats { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
          .hero-stat { padding: 12px 8px !important; }
          .hero-stat div:first-child { font-size: 18px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-arrow { display: none !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .tech-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .dest-grid { grid-template-columns: 1fr !important; }
          .cta-box { padding: 40px 20px !important; border-radius: 24px !important; }
          .cta-box h2 { font-size: 28px !important; }
          .btn-group { flex-direction: column !important; }
          .btn-primary { text-align: center !important; }
          section { padding: 60px 16px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero-bg">
        <div className="hero-bg-pattern" />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
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
                  <Link to="/login" style={{ padding: '16px 32px', borderRadius: 14, textDecoration: 'none', color: '#0f172a', fontWeight: 600, border: '2px solid #e2e8f0', display: 'inline-block' }}>
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

      <hr className="section-divider" />

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 32px', background: '#fcfdfe' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Tính năng vượt trội</span>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>Lên kế hoạch chưa bao giờ dễ đến thế</h2>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 40, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 15 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 32px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Đơn giản & Nhanh chóng</span>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>Chỉ 3 bước để có lịch trình hoàn hảo</h2>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 16, alignItems: 'center' }}>
            {[
              { step: '01', icon: '📝', title: 'Nhập thông tin', desc: 'Cho AI biết bạn muốn đi đâu, bao nhiêu ngày, ngân sách và phong cách du lịch của bạn.', color: '#eef2ff', accent: '#6366f1' },
              { step: '02', icon: '🤖', title: 'AI xử lý', desc: 'Gemini AI phân tích hàng nghìn điểm đến, tối ưu lộ trình và tính toán chi phí cho bạn.', color: '#f5f3ff', accent: '#8b5cf6' },
              { step: '03', icon: '✅', title: 'Nhận lịch trình', desc: 'Lịch trình chi tiết theo từng giờ, từng ngày sẵn sàng trong vòng 30 giây.', color: '#f0fdf4', accent: '#16a34a' },
            ].reduce((acc, item, i) => {
              acc.push(
                <div key={i} className="step-card"
                  style={{ background: item.color, border: `2px solid ${item.color}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = item.accent }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = item.color }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: item.accent, letterSpacing: 3, marginBottom: 16, opacity: 0.7 }}>BƯỚC {item.step}</div>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              )
              if (i < 2) acc.push(
                <div key={`arrow-${i}`} className="steps-arrow" style={{ fontSize: 28, color: '#cbd5e1', textAlign: 'center', flexShrink: 0 }}>→</div>
              )
              return acc
            }, [])}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── COMPARISON ── */}
      <section style={{ padding: '100px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Tại sao chọn AI Travel?</span>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>
              AI giúp bạn tiết kiệm<br />
              <em style={{ fontStyle: 'italic', color: '#6366f1' }}>hàng giờ lên kế hoạch</em>
            </h2>
          </div>
          <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '32px', border: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, background: '#fee2e2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>😓</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tự lên kế hoạch</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Cách truyền thống</div>
                </div>
              </div>
              {['Mất 2-4 giờ tìm kiếm thông tin', 'Dễ bỏ sót địa điểm hay', 'Tính chi phí thủ công, dễ sai', 'Không biết thứ tự tham quan tối ưu', 'Phải tra nhiều website khác nhau'].map((text, i, arr) => (
                <div key={i} className="compare-item" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <span style={{ color: '#ef4444', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✗</span>
                  <span style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', borderRadius: 24, padding: '32px', border: '2px solid #c7d2fe', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, background: '#6366f1', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, letterSpacing: 1 }}>ĐỀ XUẤT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, background: '#6366f1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✈️</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Dùng AI Travel</div>
                  <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 500 }}>Thông minh & Tự động</div>
                </div>
              </div>
              {['Lịch trình hoàn chỉnh trong 30 giây', 'AI gợi ý đầy đủ địa điểm nổi bật', 'Tự động tính và phân bổ ngân sách', 'Tối ưu thứ tự tham quan theo giờ', 'Tất cả trong một nền tảng duy nhất'].map((text, i, arr) => (
                <div key={i} className="compare-item" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(99,102,241,0.1)' : 'none' }}>
                  <span style={{ color: '#6366f1', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500, lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── TECH STACK ── */}
      <section style={{ padding: '80px 32px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Công nghệ sử dụng</span>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 40, fontWeight: 300, marginTop: 12, color: '#0f172a' }}>Được xây dựng bằng công nghệ hiện đại</h2>
          </div>
          <div className="tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {techStack.map((tech, i) => (
              <div key={i} className="tech-card" style={{ background: tech.color, border: `2px solid ${tech.border}` }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{tech.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{tech.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{tech.desc}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', background: 'white', padding: '3px 10px', borderRadius: 999, display: 'inline-block' }}>{tech.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── DESTINATIONS ── */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Cảm hứng cho bạn</span>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>Khám phá Việt Nam</h2>
          </div>
          <div className="dest-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {destinations.map((d, i) => (
              <div key={i} className="dest-card">
                <div style={{ width: 60, height: 60, background: d.color, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
                  {d.emoji}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 17, margin: '0 0 4px 0' }}>{d.name}</h4>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{d.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── CTA ── */}
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

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 32px', textAlign: 'center', borderTop: '2px solid #e2e8f0', color: '#94a3b8', fontSize: 14 }}>
        © 2026 AI Travel. Đồ án tốt nghiệp ngành CNTT.
      </footer>
    </div>
  )
}
