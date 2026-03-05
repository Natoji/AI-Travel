// src/components/home/FeaturesSection.jsx

const features = [
  { icon: '🤖', title: 'AI thông minh', desc: 'Gemini AI tạo lịch trình chi tiết theo từng giờ dựa trên sở thích cá nhân.' },
  { icon: '⚡', title: 'Chỉ 30 giây', desc: 'Tiết kiệm hàng giờ tìm kiếm, có ngay lịch trình hoàn chỉnh cực nhanh.' },
  { icon: '✏️', title: 'Tùy chỉnh tự do', desc: 'Dễ dàng thay đổi điểm đến, thêm bớt hoạt động và lưu lại hành trình.' },
  { icon: '💰', title: 'Tối ưu ngân sách', desc: 'Dự toán chi tiết chi phí đi lại, ăn uống và tham quan cho cả chuyến đi.' },
]

export default function FeaturesSection() {
  return (
    <section style={{ padding: '100px 32px', background: '#fcfdfe' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Tính năng vượt trội</span>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>
            Lên kế hoạch chưa bao giờ dễ đến thế
          </h2>
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
  )
}