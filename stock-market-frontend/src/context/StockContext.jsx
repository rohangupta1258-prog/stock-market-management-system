import { createContext, useState, useContext, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export const StockContext = createContext()

export function StockProvider({ children }) {
  const [stocks, setStocks]   = useState([])
  const [loading, setLoading] = useState(false)

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/stocks')
      setStocks(res.data)
    } catch (err) {
      toast.error('Failed to fetch stocks')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <StockContext.Provider value={{ stocks, loading, fetchStocks, setStocks }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStocks() {
  return useContext(StockContext)
}