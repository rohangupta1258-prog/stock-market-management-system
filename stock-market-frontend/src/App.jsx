import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { StockProvider } from './context/StockContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Stocks from './pages/Stocks'
import StockDetail from './pages/StockDetail'
import Trade from './pages/Trade'
import Portfolio from './pages/Portfolio'
import Transactions from './pages/Transactions'
import MarketAnalysis from './pages/MarketAnalysis'

export default function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1d27',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes wrapped in Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/stocks"      element={<Stocks />} />
                <Route path="/stocks/:id"  element={<StockDetail />} />
                <Route path="/trade"       element={<Trade />} />
                <Route path="/portfolio"   element={<Portfolio />} />
                <Route path="/transactions"element={<Transactions />} />
                <Route path="/market"      element={<MarketAnalysis />} />
              </Route>
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </StockProvider>
    </AuthProvider>
  )
}