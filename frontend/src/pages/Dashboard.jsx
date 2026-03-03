import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import TripForm from '../components/TripForm'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/trips/my-trips')
      .then(res => setTrips(res.data))
      .finally(() => setLoading(false))
  }, [])

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
          background: white;
          border-radius: 20px;
          border: 1.5px dashed #e2e8f0;
        }
        .stat-card {
          background: white;
          border-radius: 14px;
          padding: 20px 24px;
          border: 1px solid #f1f5f9;
        }
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
            <div style={{ fontSize: 56, marginBottom: 16 }}>✈️</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 300, color: '#0f0f1a', marginBottom: 8 }}>
              Chưa có chuyến đi nào
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24 }}>
              Hãy tạo lịch trình đầu tiên của bạn với AI
            </p>
            <button onClick={() => setShowForm(true)}
              style={{ background: '#0f0f1a', color: 'white', padding: '12px 24px', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              + Tạo lịch trình đầu tiên
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {trips.map(trip => (
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
        )}
      </div>
    </div>
  )
}