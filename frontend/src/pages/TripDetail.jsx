import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import ItineraryView from '../components/ItineraryView'
import TripForm from '../components/TripForm'

export default function TripDetail() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(res => setTrip(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRegenerated = (updatedTrip) => {
    setTrip(updatedTrip)
    setShowEditForm(false)
    navigate('/dashboard', { replace: false })
    setTimeout(() => navigate(`/trips/${updatedTrip.id}`), 0)
  }

  if (loading) return <div className='text-center py-20 text-gray-400'>⚙️ Đang tải...</div>
  if (!trip) return null

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between gap-3 mb-6'>
        <div className='flex items-center gap-3'>
          <button onClick={() => navigate('/dashboard')}
            className='text-gray-500 hover:text-gray-700 text-sm'>
            ← Quay lại
          </button>
          <h1 className='text-2xl font-bold'>✈️ {trip.destination}</h1>
        </div>
        <button
          onClick={() => setShowEditForm(prev => !prev)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: showEditForm ? '#f1f5f9' : '#eef2ff', color: showEditForm ? '#64748b' : '#6366f1', border: showEditForm ? '1.5px solid #e2e8f0' : '1.5px solid #c7d2fe', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
          {showEditForm ? '✕ Hủy' : '🔄 Sửa lịch trình'}
        </button>
      </div>

      {showEditForm && (
        <div style={{ marginBottom: 32 }}>
          <TripForm editTrip={trip} onTripCreated={handleRegenerated} />
        </div>
      )}

      <ItineraryView itinerary={trip.itinerary} tripId={trip.id} />
    </div>
  )
}