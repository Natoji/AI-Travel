import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6'>Đăng nhập</h1>
        {error && <p className='text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type='email' placeholder='Email'
            value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required />
          <input type='password' placeholder='Mật khẩu'
            value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required />
          <button type='submit' disabled={loading}
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50'>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className='text-center mt-4 text-gray-600 text-sm'>
          Chưa có tài khoản?{' '}
          <Link to='/register' className='text-blue-600 hover:underline'>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}
