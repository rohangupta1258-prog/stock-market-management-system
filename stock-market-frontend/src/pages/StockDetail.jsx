import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  ArrowLeft, TrendingUp, TrendingDown,
  ShoppingCart, DollarSign, BarChart2
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

export default function StockDetail() {
  const { id }              = useParams()
  const navigate            = useNavigate()
  const [stock, setStock]   = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStock()
    const interval = setInterval(fetchStock, 30000)
    return () => clearInterval(interval)
  }, [id])

  const fetchStock = async () => {
    try {
      const res = await api.get(`/stocks/${id}`)
      setStock(res.data)

      // Simulate price history for chart
      const base = res.data.currentPrice
      const pts  = Array.from({ length: 20 }, (_, i) => ({
        time:  `${i + 1}`,
        price: parseFloat((base * (0.97 + Math.random() * 0.06)).toFixed(2))
      }))
      pts.push({ time: '21', price: res.data.currentPrice })
      setHistory(pts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500
                      rounded-full animate-spin" />
    </div>
  )

  if (!stock) return (
    <div className="text-center py-20 text-gray-400">Stock not found</div>
  )

  const isPositive = stock.priceChangePercent >= 0

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Back button */}
      <button onClick={() => navigate('/stocks')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={18} />
        Back to Stocks
      </button>

      {/* Header card */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl btn-primary flex items-center
                            justify-center text-lg font-bold text-white">
              {stock.stockSymbol.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{stock.stockSymbol}</h1>
              <p className="text-gray-400">{stock.stockName}</p>
              <span className="text-xs px-2 py-0.5 rounded-full glass text-gray-300 mt-1 inline-block">
                {stock.sector}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              ${stock.currentPrice?.toFixed(2)}
            </p>
            <p className={`flex items-center justify-end gap-1 text-sm font-medium
              ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{stock.priceChange?.toFixed(2)} (
              {isPositive ? '+' : ''}{stock.priceChangePercent?.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-blue-400" />
          Price Trend (Simulated)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 11 }} />
            <YAxis stroke="#4b5563" tick={{ fontSize: 11 }}
                   domain={['auto', 'auto']}
                   tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px', color: '#fff' }}
              formatter={v => [`$${v}`, 'Price']} />
            <Line type="monotone" dataKey="price"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Market Cap',     value: `$${(stock.marketCap / 1e9).toFixed(0)}B`, icon: DollarSign },
          { label: 'Prev. Close',    value: `$${stock.previousPrice?.toFixed(2)}`,      icon: BarChart2  },
          { label: 'Change %',       value: `${isPositive ? '+' : ''}${stock.priceChangePercent?.toFixed(2)}%`, icon: TrendingUp },
          { label: 'Sector',         value: stock.sector,                               icon: ShoppingCart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-4 text-center">
            <Icon size={18} className="text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-2">About</h2>
        <p className="text-gray-400 text-sm">{stock.description}</p>
      </div>

      {/* Trade button */}
      <button
        onClick={() => navigate('/trade', { state: { stock } })}
        className="w-full py-4 rounded-2xl btn-primary text-white font-semibold
                   flex items-center justify-center gap-2 text-lg">
        <ShoppingCart size={20} />
        Trade {stock.stockSymbol}
      </button>
    </div>
  )
}