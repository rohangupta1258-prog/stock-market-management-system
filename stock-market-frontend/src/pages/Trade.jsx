import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  ShoppingCart, TrendingUp, TrendingDown,
  DollarSign, Plus, Minus
} from 'lucide-react'

export default function Trade() {
  const location              = useLocation()
  const { user, updateBalance } = useAuth()
  const [stocks, setStocks]   = useState([])
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [tradeType, setTradeType] = useState('BUY')
  const [loading, setLoading] = useState(false)
  const [stocksLoading, setStocksLoading] = useState(true)

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    if (location.state?.stock) {
      setSelected(location.state.stock)
    }
  }, [location.state])

  const fetchStocks = async () => {
    try {
      const res = await api.get('/stocks')
      setStocks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setStocksLoading(false)
    }
  }

  const totalCost = selected ? (selected.currentPrice * quantity).toFixed(2) : '0.00'

  const handleTrade = async () => {
    if (!selected) { toast.error('Please select a stock'); return }
    if (quantity < 1) { toast.error('Quantity must be at least 1'); return }

    setLoading(true)
    try {
      const endpoint = tradeType === 'BUY' ? '/trade/buy' : '/trade/sell'
      const res = await api.post(endpoint, {
        stockId:  selected.stockId,
        quantity: quantity,
      })

      toast.success(res.data)

      // Refresh user balance
      const portRes = await api.get('/portfolio')
      updateBalance(portRes.data.cashBalance)

      setQuantity(1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed')
    } finally {
      setLoading(false)
    }
  }

  const isPositive = selected?.priceChangePercent >= 0

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Trade Stocks</h1>
        <p className="text-gray-400 text-sm mt-1">Buy and sell stocks instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Stock selector */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-white">Select Stock</h2>

          {stocksLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500
                              rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {stocks.map(stock => (
                <div key={stock.stockId}
                     onClick={() => setSelected(stock)}
                     className={`flex items-center justify-between p-3 rounded-xl
                                 cursor-pointer transition-all
                       ${selected?.stockId === stock.stockId
                         ? 'border border-blue-500/50 bg-blue-500/10'
                         : 'hover:bg-white/5 border border-transparent'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg btn-primary flex items-center
                                    justify-center text-xs font-bold text-white">
                      {stock.stockSymbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{stock.stockSymbol}</p>
                      <p className="text-xs text-gray-500 truncate max-w-32">
                        {stock.stockName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      ${stock.currentPrice?.toFixed(2)}
                    </p>
                    <p className={`text-xs ${stock.priceChangePercent >= 0
                      ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.priceChangePercent >= 0 ? '+' : ''}
                      {stock.priceChangePercent?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trade panel */}
        <div className="space-y-4">

          {/* Selected stock info */}
          {selected && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl btn-primary flex items-center
                                  justify-center font-bold text-white">
                    {selected.stockSymbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selected.stockSymbol}</p>
                    <p className="text-xs text-gray-400">{selected.stockName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ${selected.currentPrice?.toFixed(2)}
                  </p>
                  <p className={`text-sm flex items-center justify-end gap-1
                    ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive
                      ? <TrendingUp size={12} />
                      : <TrendingDown size={12} />}
                    {isPositive ? '+' : ''}
                    {selected.priceChangePercent?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trade type toggle */}
          <div className="glass rounded-2xl p-2 flex gap-2">
            {['BUY', 'SELL'].map(type => (
              <button key={type}
                      onClick={() => setTradeType(type)}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all
                        ${tradeType === type
                          ? type === 'BUY'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white'}`}>
                {type === 'BUY' ? '▲ BUY' : '▼ SELL'}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center
                                   text-gray-400 hover:text-white transition-colors">
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center py-2 rounded-xl text-white font-bold
                             border outline-none focus:border-blue-500 text-lg"
                  style={{ background: 'rgba(255,255,255,0.05)',
                           borderColor: 'rgba(255,255,255,0.1)' }}
                />
                <button onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center
                                   text-gray-400 hover:text-white transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price per share</span>
                <span className="text-white">${selected?.currentPrice?.toFixed(2) || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Quantity</span>
                <span className="text-white">{quantity}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t"
                   style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span className="text-gray-300">Total</span>
                <span className="text-white text-lg">
  ${selected ? (selected.currentPrice * quantity).toFixed(2) : '0.00'}
</span>
              </div>
            </div>

            {/* Balance */}
            <div className="flex items-center gap-2 p-3 rounded-xl"
                 style={{ background: 'rgba(59,130,246,0.08)' }}>
              <DollarSign size={14} className="text-blue-400" />
              <span className="text-xs text-gray-400">Available Balance:</span>
              <span className="text-xs font-semibold text-blue-400">
                ${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Submit */}
            <button
              onClick={handleTrade}
              disabled={loading || !selected}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center
                          justify-center gap-2 transition-all disabled:opacity-50
                ${tradeType === 'BUY'
                  ? 'bg-green-600 hover:bg-green-500'
                  : 'bg-red-600 hover:bg-red-500'}`}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {tradeType === 'BUY' ? 'Buy' : 'Sell'} {selected?.stockSymbol || 'Stock'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}