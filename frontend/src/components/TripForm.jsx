import { useState } from 'react'
import api from '../services/api'

const STYLES = [
  { label: 'Biển', icon: '🌊' },
  { label: 'Ăn uống', icon: '🍜' },
  { label: 'Check-in', icon: '📸' },
  { label: 'Thiên nhiên', icon: '🌿' },
  { label: 'Văn hóa', icon: '🏛️' },
  { label: 'Mua sắm', icon: '🛍️' },
  { label: 'Nghỉ dưỡng', icon: '🧘' },
  { label: 'Mạo hiểm', icon: '🚵' },
  { label: 'Gia đình', icon: '👨‍👩‍👧' },
  { label: 'Lịch sử', icon: '📚' },
  { label: 'Nightlife', icon: '🌃' },
  { label: 'Ẩm thực đường phố', icon: '🍢' },
]

const BUDGET_PRESETS = [
  { label: 'Tiết kiệm', value: '1500000', desc: '~1.5 triệu' },
  { label: 'Trung bình', value: '3000000', desc: '~3 triệu' },
  { label: 'Thoải mái', value: '6000000', desc: '~6 triệu' },
]

function calcDays(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function TripForm({ onTripCreated }) {
  const [form, setForm] = useState({
    destination: '',
    departure_city: '',
    start_date: today(),
    end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    budget: '3000000',
    travel_style: [],
    people: 2,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const days = calcDays(form.start_date, form.end_date)

  const toggleStyle = (style) => {
    setForm(prev => ({
      ...prev,
      travel_style: prev.travel_style.includes(style)
        ? prev.travel_style.filter(s => s !== style)
        : [...prev.travel_style, style]
    }))
  }

  const handleStartDate = (val) => {
    setForm(prev => {
      const newEnd = val >= prev.end_date
        ? new Date(new Date(val).getTime() + 86400000).toISOString().split('T')[0]
        : prev.end_date
      return { ...prev, start_date: val, end_date: newEnd }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.departure_city) { setError('Vui lòng nhập thành phố xuất phát'); return }
    if (form.travel_style.length === 0) { setError('Vui lòng chọn ít nhất 1 phong cách'); return }
    if (days < 1) { setError('Ngày về phải sau ngày đi'); return }
    setLoading(true); setError('')
    try {
      const payload = {
        destination: form.destination,
        departure_city: form.departure_city,
        days: days,
        budget: form.budget,
        travel_style: form.travel_style,
        people: form.people,
      }
      const res = await api.post('/trips/', payload)
      onTripCreated(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra, thử lại nhé!')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;1,300&display=swap');
        .form-input {
          width: 100%; border: 1.5px solid #e2e8f0;
          border-radius: 12px; padding: 12px 16px;
          font-size: 15px; color: #0f0f1a; outline: none;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          box-sizing: border-box; background: white;
        }
        .form-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
        .form-label { font-size: 13px; font-weight: 500; color: #475569; margin-bottom: 8px; display: block; }
        .style-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: white;
          cursor: pointer; font-size: 13px; font-weight: 500;
          color: #475569; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .style-btn:hover { border-color: #c7d2fe; background: #f0f4ff; }
        .style-btn.active { border-color: #6366f1; background: #eef2ff; color: #4f46e5; }
        .budget-btn {
          flex: 1; padding: 12px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; background: white;
          cursor: pointer; text-align: center;
          transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .budget-btn:hover { border-color: #c7d2fe; }
        .budget-btn.active { border-color: #6366f1; background: #eef2ff; }
        .counter-btn {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1.5px solid #e2e8f0; background: white;
          font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; color: #475569;
        }
        .counter-btn:hover { border-color: #6366f1; color: #6366f1; }
        .trip-date-field {
          display: flex;
          flex-direction: column;
        }
        .trip-date-caption {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 6px;
          line-height: 1.25;
          min-height: 15px;
        }
        .trip-date-input {
          height: 44px;
          min-height: 44px;
          font-size: 15px;
          line-height: 1.2;
          appearance: none;
          -webkit-appearance: none;
        }
        .trip-date-input::-webkit-datetime-edit {
          padding: 0;
          line-height: 1.2;
        }
        .trip-date-input::-webkit-date-and-time-value {
          text-align: left;
          min-height: 1.2em;
        }
        .trip-date-input::-webkit-calendar-picker-indicator {
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .trip-location-grid { grid-template-columns: 1fr !important; }
          .trip-date-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .trip-date-field { width: 100%; }
          .trip-date-input { font-size: 16px; }
          .budget-presets { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f8fafc', background: 'linear-gradient(135deg, #f0f4ff, #fafafa)' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, color: '#0f0f1a', margin: 0, letterSpacing: -0.3 }}>
            ✈️ Tạo lịch trình mới
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0' }}>
            Điền thông tin bên dưới để AI tạo lịch trình cho bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fee2e2', borderRadius: 10, padding: '12px 16px', color: '#ef4444', fontSize: 13, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Xuất phát + Điểm đến */}
          <div className="trip-location-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label className="form-label">🏠 Xuất phát từ</label>
              <input value={form.departure_city}
                onChange={e => setForm({ ...form, departure_city: e.target.value })}
                placeholder="Nhập tỉnh/thành phố..."
                className="form-input" required />
            </div>
            <div>
              <label className="form-label">📍 Điểm đến</label>
              <input value={form.destination}
                onChange={e => setForm({ ...form, destination: e.target.value })}
                placeholder="Đà Nẵng, Hội An, Phú Quốc..."
                className="form-input" required />
            </div>
          </div>

          {/* Ngày đi - Ngày về */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">📅 Thời gian chuyến đi</label>
            <div className="trip-date-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="trip-date-field">
                <div className="trip-date-caption">Ngày đi</div>
                <input type="date" value={form.start_date} min={today()}
                  onChange={e => handleStartDate(e.target.value)}
                  className="form-input trip-date-input" />
              </div>
              <div className="trip-date-field">
                <div className="trip-date-caption">Ngày về</div>
                <input type="date" value={form.end_date} min={form.start_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  className="form-input trip-date-input" />
              </div>
            </div>
            {days > 0 && (
              <div style={{ background: '#eef2ff', border: '1.5px solid #c7d2fe', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 13, color: '#4f46e5' }}>
                  📆 {formatDate(form.start_date)} → {formatDate(form.end_date)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5', background: 'white', padding: '4px 12px', borderRadius: 999 }}>
                  {days} ngày
                </span>
              </div>
            )}
          </div>

          {/* Số người */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">👥 Số người</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="button" className="counter-btn"
                onClick={() => setForm(f => ({ ...f, people: Math.max(1, f.people - 1) }))}>−</button>
              <span style={{ fontSize: 20, fontWeight: 600, color: '#0f0f1a', minWidth: 32, textAlign: 'center' }}>{form.people}</span>
              <button type="button" className="counter-btn"
                onClick={() => setForm(f => ({ ...f, people: Math.min(20, f.people + 1) }))}>+</button>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>người</span>
            </div>
          </div>

          {/* Ngân sách */}
          <div style={{ marginBottom: 24 }}>
            <label className="form-label">💰 Ngân sách / người</label>
            <div className="budget-presets" style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {BUDGET_PRESETS.map(b => (
                <button key={b.value} type="button"
                  className={`budget-btn ${form.budget === b.value ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, budget: b.value })}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: form.budget === b.value ? '#4f46e5' : '#0f0f1a' }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{b.desc}</div>
                </button>
              ))}
            </div>
            <input type="number" value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="Hoặc nhập số tiền..."
              className="form-input" style={{ fontSize: 14 }} />
          </div>

          {/* Phong cách */}
          <div style={{ marginBottom: 28 }}>
            <label className="form-label">🎯 Phong cách du lịch</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STYLES.map(s => (
                <button key={s.label} type="button"
                  className={`style-btn ${form.travel_style.includes(s.label) ? 'active' : ''}`}
                  onClick={() => toggleStyle(s.label)}>
                  <span>{s.icon}</span> {s.label}
                  {form.travel_style.includes(s.label) && <span style={{ color: '#6366f1' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {form.destination && form.departure_city && form.travel_style.length > 0 && days > 0 && (
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', marginBottom: 20, border: '1px solid #f1f5f9', fontSize: 13, color: '#64748b' }}>
              📋 AI sẽ tạo lịch trình <strong style={{ color: '#0f0f1a' }}>{days} ngày</strong> từ{' '}
              <strong style={{ color: '#0f0f1a' }}>{form.departure_city}</strong> đến{' '}
              <strong style={{ color: '#0f0f1a' }}>{form.destination}</strong> cho{' '}
              <strong style={{ color: '#0f0f1a' }}>{form.people} người</strong>, phong cách{' '}
              <strong style={{ color: '#6366f1' }}>{form.travel_style.join(', ')}</strong>
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#94a3b8' : '#0f0f1a', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
            {loading
              ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span> AI đang tạo lịch trình... (15-30 giây)</>
              : '✨ Tạo lịch trình với AI'}
          </button>
        </form>
      </div>
    </div>
  )
}
