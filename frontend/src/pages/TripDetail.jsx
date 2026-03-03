import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import ItineraryView from '../components/ItineraryView'

export default function TripDetail() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(res => setTrip(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className='text-center py-20 text-gray-400'>⚙️ Đang tải...</div>
  if (!trip) return null

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='flex items-center gap-3 mb-6'>
        <button onClick={() => navigate('/dashboard')}
          className='text-gray-500 hover:text-gray-700 text-sm'>
          ← Quay lại
        </button>
        <h1 className='text-2xl font-bold'>✈️ {trip.destination}</h1>
      </div>
      <ItineraryView itinerary={trip.itinerary} />
    </div>
  )
}
