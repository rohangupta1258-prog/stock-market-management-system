import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Search, TrendingUp, TrendingDown, Filter } from 'lucide-react'

export default function Stocks() {
  const [stocks, setStocks]     = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [sector, setSector]     = useState('All')
  const [loading, setLoading]   = useState(true)
  const navigate                = useNavigate()

  const sectors = ['All', 'Technology', 'Finance', 'Healthcare', 'Energy',
                   'Automotive', 'E-Commerce', 'Semiconductors']

  useEffect(() => {
    fetchStocks()
    const interval = setInterval(fetchStocks, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let result = stocks
    if (sector !== 'All') result = result.filter(s => s.sector === sector)
    if (search) result = result.filter(s =>
      s.stockName.toLowerCase().includes(search.toLowerCase()) ||
      s.stockSymbol.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [stocks, search, sector])

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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Stock Market</h1>
        <p className="text-gray-400 text-sm mt-1">
          Live prices · Updates every 30 seconds
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500
                       border outline-none focus:border-blue-500 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)',
                     borderColor: 'rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={16} className="text-gray-400 shrink-0" />
          {sectors.map(s => (
            <button key={s} onClick={() => setSector(s)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                      transition-all ${sector === s
                        ? 'bg-blue-600 text-white'
                        : 'glass text-gray-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500
                          rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(stock => (
            <div key={stock.stockId}
                 onClick={() => navigate(`/stocks/${stock.stockId}`)}
                 className="glass rounded-2xl p-5 card-hover cursor-pointer">

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl btn-primary flex items-center
                                  justify-center text-sm font-bold text-white">
                    {stock.stockSymbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{stock.stockSymbol}</p>
                    <p className="text-xs text-gray-400">{stock.sector}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1
                                  rounded-full
                  ${stock.priceChangePercent >= 0
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'}`}>
                  {stock.priceChangePercent >= 0
                    ? <TrendingUp size={12} />
                    : <TrendingDown size={12} />}
                  {stock.priceChangePercent >= 0 ? '+' : ''}
                  {stock.priceChangePercent?.toFixed(2)}%
                </span>
              </div>

              {/* Stock name */}
              <p className="text-sm text-gray-400 mb-3 truncate">{stock.stockName}</p>

              {/* Price */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${stock.currentPrice?.toFixed(2)}
                  </p>
                  <p className={`text-sm ${stock.priceChange >= 0
                    ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.priceChange >= 0 ? '+' : ''}
                    ${stock.priceChange?.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); navigate('/trade', { state: { stock } }) }}
                  className="px-4 py-2 rounded-xl btn-primary text-white text-sm font-medium">
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}