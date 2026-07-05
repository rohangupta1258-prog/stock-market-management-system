import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  TrendingUp, TrendingDown, DollarSign,
  Briefcase, ArrowUpRight, ArrowDownRight,
  Activity, RefreshCw
} from 'lucide-react'

export default function Dashboard() {
  const { user }                        = useAuth()
  const navigate                        = useNavigate()
  const [portfolio, setPortfolio]       = useState(null)
  const [recentTx, setRecentTx]         = useState([])
  const [topStocks, setTopStocks]       = useState([])
  const [loading, setLoading]           = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [portRes, txRes, stockRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/transactions/recent'),
        api.get('/stocks'),
      ])
      setPortfolio(portRes.data)
      setRecentTx(Array.isArray(txRes.data) ? txRes.data : [])
      setTopStocks(stockRes.data.slice(0, 5))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const formatCurrency = (val) =>
    '$' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })

  const StatCard = ({ title, value, sub, icon: Icon, color, positive }) => (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`}
             style={{ background: `${color}20` }}>
          <Icon size={22} style={{ color }} />
        </div>
        {positive !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full
            ${positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {positive ? '▲' : '▼'}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500
                      rounded-full animate-spin" />
    </div>
  )

  const pl     = portfolio?.totalProfitLoss || 0
  const plPct  = portfolio?.profitLossPercent || 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.username}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening with your portfolio today
          </p>
        </div>
        <button onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass
                           text-gray-400 hover:text-white transition-all text-sm">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Cash Balance"
          value={formatCurrency(user?.balance)}
          sub="Available to invest"
          icon={DollarSign}
          color="#3b82f6"
        />
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(portfolio?.totalCurrentValue)}
          sub="Current market value"
          icon={Briefcase}
          color="#8b5cf6"
        />
        <StatCard
          title="Total Invested"
          value={formatCurrency(portfolio?.totalInvestedValue)}
          sub="Amount invested"
          icon={Activity}
          color="#f59e0b"
        />
        <StatCard
          title="Profit / Loss"
          value={formatCurrency(pl)}
          sub={`${plPct >= 0 ? '+' : ''}${plPct.toFixed(2)}% overall`}
          icon={pl >= 0 ? TrendingUp : TrendingDown}
          color={pl >= 0 ? '#10b981' : '#ef4444'}
          positive={pl >= 0}
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent transactions */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Transactions</h2>
            <button onClick={() => navigate('/transactions')}
                    className="text-blue-400 text-xs hover:text-blue-300">
              View all →
            </button>
          </div>
          {recentTx.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map(tx => (
                <div key={tx.transactionId}
                     className="flex items-center justify-between p-3 rounded-xl
                                hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${tx.type === 'BUY' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {tx.type === 'BUY'
                        ? <ArrowUpRight size={16} className="text-green-400" />
                        : <ArrowDownRight size={16} className="text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {tx.type} {tx.stock?.stockSymbol}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.quantity} shares @ ${tx.pricePerShare?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold
                      ${tx.type === 'BUY' ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.type === 'BUY' ? '-' : '+'}{formatCurrency(tx.totalValue)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top stocks */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Market Overview</h2>
            <button onClick={() => navigate('/stocks')}
                    className="text-blue-400 text-xs hover:text-blue-300">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {topStocks.map(stock => (
              <div key={stock.stockId}
                   onClick={() => navigate(`/stocks/${stock.stockId}`)}
                   className="flex items-center justify-between p-3 rounded-xl
                              hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg btn-primary flex items-center
                                  justify-center text-xs font-bold text-white">
                    {stock.stockSymbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{stock.stockSymbol}</p>
                    <p className="text-xs text-gray-500">{stock.stockName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    ${stock.currentPrice?.toFixed(2)}
                  </p>
                  <p className={`text-xs font-medium
                    ${stock.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.priceChangePercent >= 0 ? '+' : ''}
                    {stock.priceChangePercent?.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}