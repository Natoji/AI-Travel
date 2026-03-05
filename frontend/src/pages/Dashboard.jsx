import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import TripForm from '../components/TripForm'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

const location = useLocation()

  useEffect(() => {
    setLoading(true) 
    api.get('/trips/my-trips')
      .then(res => setTrips(res.data))
      .finally(() => setLoading(false))
  }, [location.key]) 

  const handleTripCreated = (newTrip) => {
    setShowForm(false)
    navigate(`/trips/${newTrip.id}`)
  }

  const handleDelete = async (tripId, e) => {
    e.stopPropagation()
    if (!confirm('Xóa chuyến đi này?')) return
    await api.delete(`/trips/${tripId}`)
    setTrips(prev => prev.filter(t => t.id !== tripId))
  }

  const getDaysAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000)
    if (diff === 0) return 'Hôm nay'
    if (diff === 1) return 'Hôm qua'
    return `${diff} ngày trước`
  }

  const filteredTrips = trips.filter(t =>
    t.destination.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#f8fafc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        .trip-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .trip-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .trip-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: #e0e7ff; }
        .trip-card:hover::before { opacity: 1; }
        .delete-btn {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid #fee2e2;
          background: #fff5f5;
          color: #ef4444;
          font-size: 14px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: all 0.2s;
        }
        .trip-card:hover .delete-btn { opacity: 1; }
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(135deg, #fafbff, #f5f3ff);
          border-radius: 20px;
          border: 1.5px dashed #c7d2fe;
        }
        @keyframes floatPlane {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-16px) rotate(5deg); }
        }
        .stat-card {
          background: white;
          border-radius: 14px;
          padding: 20px 24px;
          border: 1px solid #f1f5f9;
        }
        .search-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>
              Xin chào, {user?.name} 👋
            </p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 300, color: '#0f0f1a', letterSpacing: -0.5, margin: 0 }}>
              Chuyến đi của tôi
            </h1>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: showForm ? '#f1f5f9' : '#0f0f1a', color: showForm ? '#64748b' : 'white', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            {showForm ? '✕ Đóng' : '+ Tạo lịch trình mới'}
          </button>
        </div>

        {/* Stats */}
        {!loading && trips.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 600, color: '#0f0f1a', fontFamily: "'Fraunces', serif" }}>{trips.length}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Chuyến đi đã tạo</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 600, color: '#0f0f1a', fontFamily: "'Fraunces', serif" }}>
                {trips.reduce((sum, t) => sum + t.days, 0)}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Tổng số ngày</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 600, color: '#0f0f1a', fontFamily: "'Fraunces', serif" }}>
                {[...new Set(trips.map(t => t.destination))].length}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Điểm đến khác nhau</div>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div style={{ marginBottom: 32 }}>
            <TripForm onTripCreated={handleTripCreated} />
          </div>
        )}

        {/* Trip list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
            Đang tải...
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 72, marginBottom: 8, animation: 'floatPlane 3s ease-in-out infinite', display: 'inline-block' }}>✈️</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: '#0f172a', marginBottom: 12, letterSpacing: -0.3 }}>
              Hành trình của bạn bắt đầu từ đây
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
              Chưa có lịch trình nào. Hãy để AI lên kế hoạch cho chuyến đi mơ ước của bạn chỉ trong 30 giây!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
              {[
                { emoji: '🌊', name: 'Đà Nẵng', tag: '3 ngày' },
                { emoji: '🏮', name: 'Hội An', tag: '2 ngày' },
                { emoji: '🌴', name: 'Phú Quốc', tag: '4 ngày' },
              ].map((d, i) => (
                <div key={i} onClick={() => setShowForm(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1.5px solid #e0e7ff', borderRadius: 12, padding: '10px 16px', cursor: 'pointer', transition: 'all 0.2s', fontSize: 14, fontWeight: 500, color: '#374151' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e7ff'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <span style={{ fontSize: 20 }}>{d.emoji}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div>{d.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{d.tag}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowForm(true)}
              style={{ background: '#0f172a', color: 'white', padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = 'translateY(0)' }}>
              ✨ Tạo lịch trình đầu tiên
            </button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div style={{ marginBottom: 20, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
              <input
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm điểm đến..."
                style={{ width: '100%', padding: '12px 40px 12px 40px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', background: 'white' }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              )}
            </div>

            {/* Kết quả search */}
            {filteredTrips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 20, border: '1.5px dashed #e2e8f0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 12px 0' }}>
                  Không tìm thấy lịch trình nào cho "<strong style={{ color: '#0f172a' }}>{search}</strong>"
                </p>
                <button onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  Xóa tìm kiếm
                </button>
              </div>
            ) : (
              <>
                {search && (
                  <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
                    Tìm thấy <strong style={{ color: '#0f172a' }}>{filteredTrips.length}</strong> lịch trình
                  </p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {filteredTrips.map(trip => (
                    <div key={trip.id} className="trip-card" onClick={() => navigate(`/trips/${trip.id}`)}>
                      <button className="delete-btn" onClick={(e) => handleDelete(trip.id, e)}>🗑</button>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>
                        {trip.destination.includes('Đà Nẵng') ? '🌊' :
                        trip.destination.includes('Hội An') ? '🏮' :
                        trip.destination.includes('Phú Quốc') ? '🌴' :
                        trip.destination.includes('Sapa') ? '🏔️' :
                        trip.destination.includes('Hà Nội') ? '🏛️' : '✈️'}
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f0f1a', marginBottom: 6 }}>
                        {trip.destination}
                      </h3>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        <span style={{ fontSize: 12, background: '#f0f4ff', color: '#6366f1', padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>
                          {trip.days} ngày
                        </span>
                        <span style={{ fontSize: 12, background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>
                          {Number(trip.budget).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{getDaysAgo(trip.created_at)}</span>
                        <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>Xem lịch trình →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}