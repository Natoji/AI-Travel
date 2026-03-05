// src/components/home/DestinationsSection.jsx

const destinations = [
  { name: 'Đà Nẵng', emoji: '🌊', tag: 'Biển & Cầu Rồng', color: '#e0f2fe' },
  { name: 'Hội An', emoji: '🏮', tag: 'Phố cổ lung linh', color: '#ffedd5' },
  { name: 'Phú Quốc', emoji: '🌴', tag: 'Đảo ngọc thiên đường', color: '#dcfce7' },
  { name: 'Sapa', emoji: '🏔️', tag: 'Núi rừng hùng vĩ', color: '#f1f5f9' },
  { name: 'Hà Nội', emoji: '🏛️', tag: 'Văn hóa & Thủ đô', color: '#fee2e2' },
  { name: 'Ninh Bình', emoji: '🛶', tag: 'Tràng An thơ mộng', color: '#f5f3ff' },
]

export default function DestinationsSection() {
  return (
    <section style={{ padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Cảm hứng cho bạn</span>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>
            Khám phá Việt Nam
          </h2>
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
  )
}