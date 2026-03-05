// src/components/home/HowItWorks.jsx

const steps = [
  { step: '01', icon: '📝', title: 'Nhập thông tin', desc: 'Cho AI biết bạn muốn đi đâu, bao nhiêu ngày, ngân sách và phong cách du lịch của bạn.', color: '#eef2ff', accent: '#6366f1' },
  { step: '02', icon: '🤖', title: 'AI xử lý', desc: 'Gemini AI phân tích hàng nghìn điểm đến, tối ưu lộ trình và tính toán chi phí cho bạn.', color: '#f5f3ff', accent: '#8b5cf6' },
  { step: '03', icon: '✅', title: 'Nhận lịch trình', desc: 'Lịch trình chi tiết theo từng giờ, từng ngày sẵn sàng trong vòng 30 giây.', color: '#f0fdf4', accent: '#16a34a' },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '100px 32px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Đơn giản & Nhanh chóng</span>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>
            Chỉ 3 bước để có lịch trình hoàn hảo
          </h2>
        </div>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 16, alignItems: 'center' }}>
          {steps.reduce((acc, item, i) => {
            acc.push(
              <div key={i} className="step-card"
                style={{ background: item.color, border: '2px solid ' + item.color }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = item.color }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: item.accent, letterSpacing: 3, marginBottom: 16, opacity: 0.7 }}>BƯỚC {item.step}</div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            )
            if (i < steps.length - 1) acc.push(
              <div key={'arrow-' + i} className="steps-arrow" style={{ fontSize: 28, color: '#cbd5e1', textAlign: 'center', flexShrink: 0 }}>→</div>
            )
            return acc
          }, [])}
        </div>
      </div>
    </section>
  )
}