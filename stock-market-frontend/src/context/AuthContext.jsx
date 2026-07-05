import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser  = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateBalance = (newBalance) => {
    if (newBalance === undefined || newBalance === null) return
    const updatedUser = { ...user, balance: newBalance }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const refreshBalance = async () => {
    try {
      const res = await api.get('/portfolio')
      updateBalance(res.data.cashBalance)
    } catch (err) {
      console.error('Balance refresh failed', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, logout,
      updateBalance, refreshBalance,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}