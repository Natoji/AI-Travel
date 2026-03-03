import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6'>Tạo tài khoản</h1>
        {error && <p className='text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type='text' placeholder='Họ và tên'
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required />
          <input type='email' placeholder='Email'
            value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required />
          <input type='password' placeholder='Mật khẩu (ít nhất 6 ký tự)'
            value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            className='w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required minLength={6} />
          <button type='submit' disabled={loading}
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50'>
            {loading ? 'Đang tạo...' : 'Đăng ký'}
          </button>
        </form>
        <p className='text-center mt-4 text-gray-600 text-sm'>
          Đã có tài khoản?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
