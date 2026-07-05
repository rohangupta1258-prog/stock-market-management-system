import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  History, ArrowUpRight, ArrowDownRight,
  RefreshCw, Search
} from 'lucide-react'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filter, setFilter]             = useState('ALL')

  useEffect(() => { fetchTransactions() }, [])

  useEffect(() => {
    let result = transactions
    if (filter !== 'ALL') result = result.filter(t => t.type === filter)
    if (search) result = result.filter(t =>
      t.stock?.stockSymbol?.toLowerCase().includes(search.toLowerCase()) ||
      t.stock?.stockName?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [transactions, filter, search])

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions')
      setTransactions(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fmt = (val) =>
    '$' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })

  const formatDate = (ts) => {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }) + ' · ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    })
  }

  // Summary stats
  const totalBought = transactions
    .filter(t => t.type === 'BUY')
    .reduce((sum, t) => sum + t.totalValue, 0)

  const totalSold = transactions
    .filter(t => t.type === 'SELL')
    .reduce((sum, t) => sum + t.totalValue, 0)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-400 text-sm mt-1">All your trades</p>
        </div>
        <button onClick={fetchTransactions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass
                           text-gray-400 hover:text-white transition-all text-sm">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Total Bought</p>
          <p className="text-2xl font-bold text-red-400">{fmt(totalBought)}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Total Sold</p>
          <p className="text-2xl font-bold text-green-400">{fmt(totalSold)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by stock..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500
                       border outline-none focus:border-blue-500 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)',
                     borderColor: 'rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'BUY', 'SELL'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition-all
                      ${filter === f
                        ? f === 'BUY' ? 'bg-green-600 text-white'
                          : f === 'SELL' ? 'bg-red-600 text-white'
                          : 'bg-blue-600 text-white'
                        : 'glass text-gray-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500
                            rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <History size={40} className="mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Type', 'Stock', 'Quantity', 'Price/Share', 'Total', 'Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.transactionId}
                      className="hover:bg-white/3 transition-colors border-b"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-3 py-1
                                        rounded-full text-xs font-semibold
                        ${tx.type === 'BUY'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'}`}>
                        {tx.type === 'BUY'
                          ? <ArrowUpRight size={12} />
                          : <ArrowDownRight size={12} />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg btn-primary flex items-center
                                        justify-center text-xs font-bold text-white">
                          {tx.stock?.stockSymbol?.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {tx.stock?.stockSymbol}
                          </p>
                          <p className="text-xs text-gray-500 max-w-28 truncate">
                            {tx.stock?.stockName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{tx.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      ${tx.pricePerShare?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold
                        ${tx.type === 'BUY' ? 'text-red-400' : 'text-green-400'}`}>
                        {tx.type === 'BUY' ? '-' : '+'}{fmt(tx.totalValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {formatDate(tx.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}