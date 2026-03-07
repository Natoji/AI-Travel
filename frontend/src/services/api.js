import axios from 'axios'

const TOKEN_STORAGE_KEY = 'token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function shouldRedirectToLogin() {
  return window.location.pathname !== '/login'
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

// Tu dong dinh kem token vao moi request
api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tu dong logout khi token het han
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken()
      if (shouldRedirectToLogin()) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
