import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  Briefcase, TrendingUp, TrendingDown,
  DollarSign, RefreshCw, ShoppingCart
} from 'lucide-react'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading]     = useState(true)
  const navigate                  = useNavigate()

  useEffect(() => {
    fetchPortfolio()
    const interval = setInterval(fetchPortfolio, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/portfolio')
      setPortfolio(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fmt = (val) =>
    '$' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500
                      rounded-full animate-spin" />
    </div>
  )

  const holdings  = portfolio?.holdings || []
  const pl        = portfolio?.totalProfitLoss || 0
  const plPct     = portfolio?.profitLossPercent || 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
          <p className="text-gray-400 text-sm mt-1">Your stock holdings</p>
        </div>
        <button onClick={fetchPortfolio}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass
                           text-gray-400 hover:text-white transition-all text-sm">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Portfolio Value',
            value: fmt(portfolio?.totalCurrentValue),
            icon: Briefcase,
            color: '#8b5cf6'
          },
          {
            label: 'Total Invested',
            value: fmt(portfolio?.totalInvestedValue),
            icon: DollarSign,
            color: '#3b82f6'
          },
          {
            label: 'Profit / Loss',
            value: fmt(pl),
            icon: pl >= 0 ? TrendingUp : TrendingDown,
            color: pl >= 0 ? '#10b981' : '#ef4444',
            sub: `${plPct >= 0 ? '+' : ''}${plPct.toFixed(2)}%`
          },
          {
            label: 'Cash Balance',
            value: fmt(portfolio?.cashBalance),
            icon: DollarSign,
            color: '#f59e0b'
          },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="glass rounded-2xl p-5 card-hover">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                 style={{ background: `${color}20` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-xl font-bold text-white mt-1">{value}</p>
            {sub && (
              <p className={`text-xs mt-1 ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b"
             style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="font-semibold text-white">Holdings</h2>
          <span className="text-xs text-gray-400">{holdings.length} positions</span>
        </div>

        {holdings.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase size={40} className="mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 mb-4">No holdings yet</p>
            <button onClick={() => navigate('/stocks')}
                    className="px-6 py-2 rounded-xl btn-primary text-white text-sm">
              Browse Stocks
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Stock', 'Qty', 'Avg Buy', 'Current', 'Invested', 'Value', 'P&L', 'Action']
                    .map(h => (
                      <th key={h} className="px-6 py-3 text-left">{h}</th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {holdings.map(h => {
                  const pl    = h.profitLoss || 0
                  const plPct = h.profitLossPercent || 0
                  return (
                    <tr key={h.portfolioId}
                        className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg btn-primary flex items-center
                                          justify-center text-xs font-bold text-white">
                            {h.stock?.stockSymbol?.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {h.stock?.stockSymbol}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-24">
                              {h.stock?.stockName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {h.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        ${h.averageBuyPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        ${h.stock?.currentPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        ${h.totalInvestedValue?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        ${h.currentMarketValue?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm font-semibold
                            ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                          </p>
                          <p className={`text-xs
                            ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {plPct >= 0 ? '+' : ''}{plPct.toFixed(2)}%
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate('/trade', { state: { stock: h.stock } })}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                                     btn-primary text-white text-xs font-medium">
                          <ShoppingCart size={12} />
                          Trade
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}