import { useState } from 'react'

const PERIOD_MAP = {
  'Sang': { label: 'Buổi sáng', icon: '🌅', bg: '#fef9c3', color: '#92400e' },
  'Trua': { label: 'Buổi trưa', icon: '☀️', bg: '#fff7ed', color: '#9a3412' },
  'Chieu': { label: 'Buổi chiều', icon: '🌤️', bg: '#f0f9ff', color: '#0369a1' },
  'Toi': { label: 'Buổi tối', icon: '🌙', bg: '#f5f3ff', color: '#6d28d9' },
}

const BUDGET_KEYS = {
  luu_tru: '🏠 Lưu trú',
  an_uong: '🍜 Ăn uống',
  di_chuyen: '🚗 Di chuyển',
  hoat_dong: '🎯 Hoạt động',
  mua_sam_phat_sinh: '🛍️ Mua sắm & phát sinh',
  accommodation: '🏨 Lưu trú',
  food: '🍜 Ăn uống',
  transport: '🚗 Di chuyển',
  activities: '🎯 Hoạt động',
  shopping: '🛍️ Mua sắm',
  shopping_miscellaneous: '🛍️ Mua sắm & phát sinh',
  miscellaneous: '📦 Chi phí phát sinh',
  contingency: '🛡️ Dự phòng',
  entertainment: '🎭 Giải trí',
  other: '📦 Khác',
  transportation: '🚗 Di chuyển',
  travel: '🚗 Di chuyển',
  meals: '🍜 Ăn uống',
  dining: '🍜 Ăn uống',
  lodging: '🏠 Lưu trú',
  hotel: '🏠 Lưu trú',
  sightseeing: '🎯 Tham quan',
  tours: '🎯 Tour & tham quan',
  entrance_fees: '🎫 Vé vào cửa',
}

export default function ItineraryView({ itinerary }) {
  const [activeDay, setActiveDay] = useState(0)
  if (!itinerary) return null
  const { trip_summary, days, accommodation, packing_list, budget_breakdown } = itinerary

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;1,300&display=swap');
        .day-tab {
          padding: 8px 18px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: white;
          font-size: 13px; font-weight: 500; color: #64748b;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .day-tab:hover { border-color: #c7d2fe; color: #4f46e5; }
        .day-tab.active { border-color: #6366f1; background: #eef2ff; color: #4f46e5; }
        .schedule-row {
          display: grid;
          grid-template-columns: 56px 1fr 110px;
          gap: 16px; align-items: flex-start;
          padding: 18px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .schedule-row:last-child { border-bottom: none; }
        .hotel-card {
          border: 1px solid #f1f5f9; border-radius: 14px;
          padding: 16px 20px; transition: all 0.2s; background: white;
        }
        .hotel-card:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.06); }
        .pack-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f8fafc; border: 1px solid #f1f5f9;
          border-radius: 8px; padding: 6px 12px;
          font-size: 13px; color: #475569;
        }
        .budget-row {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid #f8fafc;
        }
        .budget-row:last-child { border-bottom: none; }
        @media (max-width: 768px) {
          .schedule-row { grid-template-columns: 48px 1fr !important; }
          .schedule-cost { display: none !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .day-tab { padding: 6px 12px !important; font-size: 12px !important; }
          .accommodation-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1e1b4b 100%)', borderRadius: 20, padding: '28px 32px', marginBottom: 24, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 8px 0' }}>Lịch trình AI ✨</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 300, margin: '0 0 8px 0', letterSpacing: -0.5 }}>
              📍 {trip_summary?.destination}
            </h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>🌤️ Thời điểm tốt nhất: {trip_summary?.best_time}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 600, fontFamily: "'Fraunces', serif" }}>{trip_summary?.total_days}</div>
              <div style={{ fontSize: 12, color: '#a5b4fc', marginTop: 2 }}>Ngày</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{trip_summary?.estimated_cost}</div>
              <div style={{ fontSize: 12, color: '#a5b4fc', marginTop: 2 }}>Ước tính/người</div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {days?.map((day, i) => (
          <button key={i} className={`day-tab ${activeDay === i ? 'active' : ''}`} onClick={() => setActiveDay(i)}>
            Ngày {day.day}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {days?.[activeDay] && (
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, background: '#eef2ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#6366f1', flexShrink: 0 }}>
              {days[activeDay].day}
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300, color: '#0f0f1a', margin: 0, letterSpacing: -0.3 }}>
              {days[activeDay].title}
            </h3>
          </div>
          <div style={{ padding: '4px 28px' }}>
            {days[activeDay].schedule?.map((item, idx) => {
              const period = PERIOD_MAP[item.period] || { label: item.period, icon: '📌', bg: '#f8fafc', color: '#64748b' }
              return (
                <div key={idx} className="schedule-row">
                  <div style={{ textAlign: 'center', paddingTop: 4 }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{period.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', fontFamily: 'monospace' }}>{item.time}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#0f0f1a' }}>{item.place}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: period.bg, color: period.color, fontWeight: 600 }}>
                        {period.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>📍 {item.address}</div>
                    <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{item.description}</div>
                    {/* Hiện chi phí trên mobile (vì cột phải bị ẩn) */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', marginTop: 6, display: 'none' }} className="mobile-cost">
                      💰 {item.estimated_cost} · ⏱ {item.duration}
                    </div>
                    {item.tips && (
                      <div style={{ marginTop: 10, fontSize: 12, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '7px 12px', display: 'inline-block' }}>
                        💡 {item.tips}
                      </div>
                    )}
                  </div>
                  <div className="schedule-cost" style={{ textAlign: 'right', paddingTop: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', lineHeight: 1.4 }}>{item.estimated_cost}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>⏱ {item.duration}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budget + Packing */}
      <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {budget_breakdown && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f0f1a', margin: '0 0 16px 0' }}>💵 Phân bổ ngân sách</h3>
            {Object.entries(budget_breakdown).map(([key, val]) => (
              <div key={key} className="budget-row">
                <span style={{ fontSize: 14, color: '#475569', flexShrink: 0 }}>
                  {BUDGET_KEYS[key] || '📌 ' + key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f0f1a', textAlign: 'right', wordBreak: 'break-word' }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        {packing_list?.length > 0 && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f0f1a', margin: '0 0 16px 0' }}>🎒 Đồ cần mang</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {packing_list.map((item, i) => (
                <span key={i} className="pack-chip">
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>✓</span> {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accommodation */}
      {accommodation?.length > 0 && (
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f0f1a', margin: '0 0 16px 0' }}>🏨 Chỗ ở gợi ý</h3>
          <div className="accommodation-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {accommodation.map((h, i) => (
              <div key={i} className="hotel-card">
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f0f1a', marginBottom: 6 }}>{h.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>📍 {h.area}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', padding: '4px 10px', background: '#f0fdf4', borderRadius: 6, display: 'inline-block', marginBottom: 8 }}>
                  {h.price_range}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{h.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}