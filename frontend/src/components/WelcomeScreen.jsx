import { useState, useEffect } from "react"

const slides = [
  {
    id: 0,
    type: "splash",
  },
  {
    id: 1,
    emoji: "🤖",
    tag: "AI AGENT",
    title: "Lịch trình thông minh\nchỉ trong vài giây",
    desc: "AI tự động gọi dữ liệu thời tiết, địa điểm thực tế và tỷ giá để tạo lịch trình cá nhân hoá cho bạn.",
    accent: "#6366f1",
    bg: "linear-gradient(160deg, #eef2ff 0%, #f5f3ff 50%, #ede9fe 100%)",
    visual: "ai",
  },
  {
    id: 2,
    emoji: "🗺️",
    tag: "BẢN ĐỒ THỰC TẾ",
    title: "Xem lộ trình\ntrực tiếp trên bản đồ",
    desc: "Markers đánh số từng điểm dừng, đường nối theo ngày, click vào địa điểm để focus trên bản đồ.",
    accent: "#0ea5e9",
    bg: "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
    visual: "map",
  },
  {
    id: 3,
    emoji: "💰",
    tag: "NGÂN SÁCH",
    title: "Quản lý chi phí\nthông minh",
    desc: "Phân bổ ngân sách theo từng hạng mục, ước tính chi phí từng hoạt động, hỗ trợ tỷ giá ngoại tệ.",
    accent: "#10b981",
    bg: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
    visual: "budget",
  },
]

// ── Floating elements ─────────────────────────────────────────────────────────
function FloatingEl({ children, style }) {
  return (
    <div style={{
      position: "absolute",
      animation: "float 4s ease-in-out infinite",
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Visual AI ─────────────────────────────────────────────────────────────────
function VisualAI() {
  return (
    <div style={{ position: "relative", width: 320, height: 280, margin: "0 auto" }}>
      {/* Main card */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        background: "white", borderRadius: 20,
        padding: "20px 24px", width: 260,
        boxShadow: "0 20px 60px rgba(99,102,241,0.15)",
        border: "1px solid rgba(99,102,241,0.1)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: 1, marginBottom: 10 }}>
          ✨ AI ĐANG TẠO LỊCH TRÌNH
        </div>
        {["Kiểm tra thời tiết...", "Tìm địa điểm nổi bật...", "Tính toán ngân sách..."].map((t, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 8, animation: `fadeIn 0.5s ${i * 0.3}s both`,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#6366f1", flexShrink: 0,
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.5}s`,
            }} />
            <span style={{ fontSize: 12, color: "#475569" }}>{t}</span>
          </div>
        ))}
        <div style={{
          marginTop: 12, background: "#eef2ff", borderRadius: 10,
          padding: "10px 12px", fontSize: 12, color: "#4338ca", fontWeight: 600,
        }}>
          🎉 Lịch trình đã sẵn sàng!
        </div>
      </div>

      {/* Floating badges */}
      <FloatingEl style={{ top: 10, right: 20, animationDelay: "0s" }}>
        <div style={{ background: "#6366f1", color: "white", borderRadius: 12, padding: "6px 12px", fontSize: 11, fontWeight: 700, boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
          🌤️ 22°C
        </div>
      </FloatingEl>
      <FloatingEl style={{ bottom: 20, left: 10, animationDelay: "1.5s" }}>
        <div style={{ background: "white", borderRadius: 12, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#10b981", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #dcfce7" }}>
          📍 15 địa điểm
        </div>
      </FloatingEl>
    </div>
  )
}

// ── Visual Map ────────────────────────────────────────────────────────────────
function VisualMap() {
  const dots = [
    { x: 80, y: 90, label: "1", color: "#0ea5e9" },
    { x: 160, y: 60, label: "2", color: "#0ea5e9" },
    { x: 220, y: 120, label: "3", color: "#0ea5e9" },
    { x: 180, y: 190, label: "4", color: "#0ea5e9" },
    { x: 100, y: 200, label: "⚑", color: "#ef4444" },
  ]
  return (
    <div style={{ position: "relative", width: 320, height: 280, margin: "0 auto" }}>
      {/* Map background */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 24,
        background: "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)",
        overflow: "hidden", boxShadow: "0 20px 60px rgba(14,165,233,0.2)",
      }}>
        {/* Grid lines */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: `${i * 20}%`, height: 1,
            background: "rgba(255,255,255,0.2)",
          }} />
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${i * 20}%`, width: 1,
            background: "rgba(255,255,255,0.2)",
          }} />
        ))}
        {/* Road-like shapes */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 320 280">
          <path d="M 80 90 Q 120 70 160 60 Q 190 80 220 120 Q 210 155 180 190 Q 140 210 100 200"
            fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 4" opacity="0.7" />
          {dots.map((d, i) => (
            <g key={i} style={{ animation: `popIn 0.4s ${i * 0.15}s both` }}>
              <circle cx={d.x} cy={d.y} r="16" fill="white" opacity="0.9" />
              <circle cx={d.x} cy={d.y} r="12" fill={d.color} />
              <text x={d.x} y={d.y + 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="800">{d.label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Popup card */}
      <FloatingEl style={{ bottom: -10, right: -10, animationDelay: "1s" }}>
        <div style={{
          background: "white", borderRadius: 14, padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 140,
          border: "1px solid rgba(14,165,233,0.1)",
        }}>
          <div style={{ fontSize: 10, color: "#0ea5e9", fontWeight: 700, marginBottom: 3 }}>📍 #2 TRÊN BẢN ĐỒ</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Hồ Xuân Hương</div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>🕐 10:00 · Miễn phí</div>
        </div>
      </FloatingEl>
    </div>
  )
}

// ── Visual Budget ─────────────────────────────────────────────────────────────
function VisualBudget() {
  const items = [
    { icon: "🏠", label: "Lưu trú", amount: "1.500.000", pct: 35, color: "#10b981" },
    { icon: "🍜", label: "Ăn uống", amount: "900.000", pct: 22, color: "#f59e0b" },
    { icon: "🚗", label: "Di chuyển", amount: "800.000", pct: 19, color: "#6366f1" },
    { icon: "🎯", label: "Hoạt động", amount: "600.000", pct: 14, color: "#0ea5e9" },
  ]
  return (
    <div style={{ position: "relative", width: 300, margin: "0 auto" }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "20px 22px",
        boxShadow: "0 20px 60px rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>💵 Phân bổ ngân sách</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", background: "#f0fdf4", padding: "3px 8px", borderRadius: 8 }}>5.000.000đ</span>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: 10, animation: `slideIn 0.4s ${i * 0.1}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>{item.icon} {item.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>{item.amount}đ</span>
            </div>
            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${item.pct}%`, background: item.color,
                borderRadius: 99, animation: `grow 0.8s ${i * 0.15}s both`,
              }} />
            </div>
          </div>
        ))}
      </div>

      <FloatingEl style={{ top: -16, right: 0, animationDelay: "0.8s" }}>
        <div style={{ background: "#10b981", color: "white", borderRadius: 12, padding: "6px 12px", fontSize: 11, fontWeight: 700, boxShadow: "0 4px 12px rgba(16,185,129,0.4)" }}>
          💱 1 USD = 26.200đ
        </div>
      </FloatingEl>
    </div>
  )
}

// ── Splash Screen ─────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "linear-gradient(160deg, #38bdf8 0%, #0ea5e9 40%, #6366f1 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      animation: "fadeOut 0.5s 1.8s both",
    }}>
      {/* Clouds */}
      <div style={{ position: "absolute", top: "8%", left: "-10%", width: "70%", opacity: 0.6 }}>
        <svg viewBox="0 0 300 80" fill="white">
          <ellipse cx="150" cy="60" rx="140" ry="40" />
          <ellipse cx="100" cy="45" rx="70" ry="35" />
          <ellipse cx="200" cy="50" rx="60" ry="30" />
        </svg>
      </div>
      <div style={{ position: "absolute", top: "15%", right: "-5%", width: "50%", opacity: 0.4 }}>
        <svg viewBox="0 0 200 60" fill="white">
          <ellipse cx="100" cy="45" rx="90" ry="30" />
          <ellipse cx="60" cy="35" rx="50" ry="25" />
          <ellipse cx="150" cy="38" rx="45" ry="22" />
        </svg>
      </div>

      {/* Logo */}
      <div style={{ animation: "splashIn 0.6s 0.2s both", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>✈️</div>
        <div style={{
          fontSize: 42, fontWeight: 900, color: "white",
          fontFamily: "'Fraunces', serif", letterSpacing: -1,
          textShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          AI Travel
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 6, letterSpacing: 2, fontWeight: 500 }}>
          KHÁM PHÁ · TRẢI NGHIỆM
        </div>
      </div>

      {/* Loading dots */}
      <div style={{ position: "absolute", bottom: "12%", display: "flex", gap: 8, animation: "splashIn 0.6s 0.8s both" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            animation: `bounce 1s ${i * 0.2}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Main Welcome Screen ───────────────────────────────────────────────────────
export default function WelcomeScreen({ onGetStarted }) {
  const [showSplash, setShowSplash] = useState(true)
  const [current, setCurrent] = useState(1)

  const slide = slides.find(s => s.id === current)

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1)
    else onGetStarted?.()
  }
  const skip = () => onGetStarted?.()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@300;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes grow { from{width:0} to{width:var(--w,100%)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes splashIn { from{opacity:0;transform:scale(0.8) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0;pointer-events:none} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .welcome-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .welcome-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .welcome-visual {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 24px 0;
          animation: slideUp 0.5s both;
        }
        .welcome-text {
          padding: 24px 32px 16px;
          animation: slideUp 0.5s 0.1s both;
        }
        .welcome-actions {
          padding: 12px 32px 40px;
        }
        .welcome-visual-inner {
          width: 100%;
          max-width: 360px;
        }
        @media (min-width: 768px) {
          .welcome-body {
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 48px;
            padding: 0 60px;
            max-width: 1000px;
            margin: 0 auto;
            width: 100%;
          }
          .welcome-visual {
            flex: 1;
            padding: 40px 0;
          }
          .welcome-visual-inner {
            max-width: 480px;
            transform: scale(1.2);
          }
          .welcome-text {
            flex: 1;
            padding: 0;
          }
          .welcome-text h2 {
            font-size: 36px !important;
          }
          .welcome-text p {
            font-size: 16px !important;
          }
          .welcome-actions {
            padding: 24px 0 0;
          }
          .welcome-actions button {
            max-width: 320px;
          }
        }
        @media (min-width: 1200px) {
          .welcome-visual-inner {
            max-width: 540px;
            transform: scale(1.35);
          }
          .welcome-body {
            gap: 80px;
          }
        }
      `}</style>

      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div className="welcome-layout" style={{
        fontFamily: "'DM Sans', sans-serif",
        background: slide?.bg || "#f8fafc",
        transition: "background 0.5s ease",
        overflowX: "hidden",
      }}>
        {/* Skip button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 24px 0" }}>
          <button onClick={skip} style={{
            background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 20,
            padding: "6px 16px", fontSize: 13, color: "#64748b",
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>
            Bỏ qua
          </button>
        </div>

        <div className="welcome-body">
          {/* Visual area */}
          <div className="welcome-visual">
            <div className="welcome-visual-inner">
              {slide?.visual === "ai" && <VisualAI />}
              {slide?.visual === "map" && <VisualMap />}
              {slide?.visual === "budget" && <VisualBudget />}
            </div>
          </div>

          {/* Text + Actions */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="welcome-text">
              <div style={{
                display: "inline-block", fontSize: 10, fontWeight: 800,
                letterSpacing: 2, color: slide?.accent,
                background: `${slide?.accent}18`, borderRadius: 20,
                padding: "4px 12px", marginBottom: 12,
              }}>
                {slide?.tag}
              </div>
              <h2 style={{
                fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "0 0 12px",
                fontFamily: "'Fraunces', serif", lineHeight: 1.25, letterSpacing: -0.5,
                whiteSpace: "pre-line",
              }}>
                {slide?.title}
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                {slide?.desc}
              </p>
            </div>

            {/* Dots + Button */}
            <div className="welcome-actions">
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {slides.filter(s => s.id > 0).map(s => (
                  <div key={s.id} onClick={() => setCurrent(s.id)} style={{
                    height: 6, borderRadius: 99, cursor: "pointer",
                    background: current === s.id ? slide?.accent : "#cbd5e1",
                    width: current === s.id ? 24 : 6,
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>
              <button onClick={next} style={{
                width: "100%", padding: "16px", border: "none", borderRadius: 16,
                background: slide?.accent, color: "white",
                fontSize: 16, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", letterSpacing: 0.3,
                boxShadow: `0 8px 24px ${slide?.accent}44`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {current < slides.length - 1 ? "Tiếp theo →" : "Bắt đầu ngay 🚀"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
