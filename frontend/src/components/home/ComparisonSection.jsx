// src/components/home/ComparisonSection.jsx

const manualItems = [
  'Mất 2-4 giờ tìm kiếm thông tin',
  'Dễ bỏ sót địa điểm hay',
  'Tính chi phí thủ công, dễ sai',
  'Không biết thứ tự tham quan tối ưu',
  'Phải tra nhiều website khác nhau',
]

const aiItems = [
  'Lịch trình hoàn chỉnh trong 30 giây',
  'AI gợi ý đầy đủ địa điểm nổi bật',
  'Tự động tính và phân bổ ngân sách',
  'Tối ưu thứ tự tham quan theo giờ',
  'Tất cả trong một nền tảng duy nhất',
]

export default function ComparisonSection() {
  return (
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

          {/* Tự lên kế hoạch */}
          <div style={{ background: 'white', borderRadius: 24, padding: '32px', border: '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, background: '#fee2e2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>😓</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tự lên kế hoạch</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Cách truyền thống</div>
              </div>
            </div>
            {manualItems.map((text, i) => (
              <div key={i} className="compare-item" style={{ borderBottom: i < manualItems.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <span style={{ color: '#ef4444', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✗</span>
                <span style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Dùng AI Travel */}
          <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', borderRadius: 24, padding: '32px', border: '2px solid #c7d2fe', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, background: '#6366f1', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, letterSpacing: 1 }}>ĐỀ XUẤT</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 44, height: 44, background: '#6366f1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✈️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Dùng AI Travel</div>
                <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 500 }}>Thông minh & Tự động</div>
              </div>
            </div>
            {aiItems.map((text, i) => (
              <div key={i} className="compare-item" style={{ borderBottom: i < aiItems.length - 1 ? '1px solid rgba(99,102,241,0.1)' : 'none' }}>
                <span style={{ color: '#6366f1', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}