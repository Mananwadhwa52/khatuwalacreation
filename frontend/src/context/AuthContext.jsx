import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => { try { return JSON.parse(localStorage.getItem('kw_user')) } catch { return null } })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('kw_token')
    if (token) {
      api.get('/auth/me').then(r => { setUser(r.data.user); localStorage.setItem('kw_user', JSON.stringify(r.data.user)) })
        .catch(() => { localStorage.removeItem('kw_token'); localStorage.removeItem('kw_user'); setUser(null) })
        .finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('kw_token', data.token)
    localStorage.setItem('kw_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone })
    localStorage.setItem('kw_token', data.token)
    localStorage.setItem('kw_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('kw_token'); localStorage.removeItem('kw_user'); setUser(null)
  }

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      localStorage.setItem('kw_user', JSON.stringify(data.user))
    } catch (e) {
      console.error('Failed to refresh user', e)
    }
  }


  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, refreshUser }}>
    {children}
  </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
