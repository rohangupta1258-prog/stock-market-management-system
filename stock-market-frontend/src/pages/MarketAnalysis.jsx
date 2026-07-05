import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  TrendingUp, TrendingDown, BarChart2, RefreshCw
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
                '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1']

export default function MarketAnalysis() {
  const [stocks, setStocks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStocks()
    const interval = setInterval(fetchStocks, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStocks = async () => {
    try {
      const res = await api.get('/stocks')
      setStocks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const gainers = [...stocks]
    .sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    .slice(0, 5)

  const losers = [...stocks]
    .sort((a, b) => a.priceChangePercent - b.priceChangePercent)
    .slice(0, 5)

  const sectorData = stocks.reduce((acc, stock) => {
    const existing = acc.find(s => s.sector === stock.sector)
    if (existing) {
      existing.value += 1
      existing.marketCap += stock.marketCap || 0
    } else {
      acc.push({
        sector: stock.sector,
        value: 1,
        marketCap: stock.marketCap || 0
      })
    }
    return acc
  }, [])

  const priceData = stocks.map(s => ({
    symbol: s.stockSymbol,
    price:  s.currentPrice,
    change: parseFloat(s.priceChangePercent?.toFixed(2))
  }))

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500
                      rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time market trends and insights
          </p>
        </div>
        <button onClick={fetchStocks}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass
                           text-gray-400 hover:text-white transition-all text-sm">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Top gainers + losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gainers */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-400" />
            Top Gainers
          </h2>
          <div className="space-y-3">
            {gainers.map((stock, i) => (
              <div key={stock.stockId}
                   className="flex items-center justify-between p-3 rounded-xl
                              hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center
                                  justify-center text-xs font-bold text-white">
                    {stock.stockSymbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{stock.stockSymbol}</p>
                    <p className="text-xs text-gray-500">${stock.currentPrice?.toFixed(2)}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400
                                 text-sm font-semibold">
                  +{stock.priceChangePercent?.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-red-400" />
            Top Losers
          </h2>
          <div className="space-y-3">
            {losers.map((stock, i) => (
              <div key={stock.stockId}
                   className="flex items-center justify-between p-3 rounded-xl
                              hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-4">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center
                                  justify-center text-xs font-bold text-white">
                    {stock.stockSymbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{stock.stockSymbol}</p>
                    <p className="text-xs text-gray-500">${stock.currentPrice?.toFixed(2)}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400
                                 text-sm font-semibold">
                  {stock.priceChangePercent?.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Price comparison bar chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-blue-400" />
          Price Comparison
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="symbol" stroke="#4b5563" tick={{ fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fontSize: 12 }}
                   tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{ background: '#1a1d27',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px', color: '#fff' }}
              formatter={v => [`$${v}`, 'Price']} />
            <Bar dataKey="price" radius={[6, 6, 0, 0]}>
              {priceData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* % Change line chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-purple-400" />
          Daily % Change
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="symbol" stroke="#4b5563" tick={{ fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fontSize: 12 }}
                   tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#1a1d27',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px', color: '#fff' }}
              formatter={v => [`${v}%`, 'Change']} />
            <Bar dataKey="change" radius={[6, 6, 0, 0]}>
              {priceData.map((entry, i) => (
                <Cell key={i}
                      fill={entry.change >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector distribution pie */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Sector Distribution</h2>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="value"
                nameKey="sector"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ sector, percent }) =>
                  `${sector} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {sectorData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1d27',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', color: '#fff' }}
                formatter={(v, name) => [v + ' stocks', name]} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>
                )} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}