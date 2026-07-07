import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IndianRupee, ShoppingBag, Clock, CheckCircle, Package, TrendingUp } from 'lucide-react'
import api from '../../utils/api'

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="font-body text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="font-display text-2xl font-bold text-gray-800">{value}</p>
        {sub && <p className="font-body text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders/admin/stats'),
      api.get('/orders?limit=5'),
    ]).then(([s, o]) => {
      setStats(s.data)
      setRecentOrders(o.data.orders || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>

  const STATUS_COLORS = { placed:'bg-blue-100 text-blue-700', confirmed:'bg-indigo-100 text-indigo-700', processing:'bg-yellow-100 text-yellow-700', shipped:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700', refund_requested:'bg-orange-100 text-orange-700', refunded:'bg-gray-100 text-gray-600' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Dashboard</h1>
        <p className="font-body text-sm text-gray-400">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<IndianRupee size={22} className="text-green-600"/>} label="Total Revenue" value={`₹${(stats?.revenue || 0).toLocaleString()}`} sub="Paid orders" color="bg-green-50"/>
        <StatCard icon={<ShoppingBag size={22} className="text-blue-600"/>} label="Total Orders" value={stats?.totalOrders || 0} sub="All time" color="bg-blue-50"/>
        <StatCard icon={<Clock size={22} className="text-yellow-600"/>} label="Pending Orders" value={stats?.pendingOrders || 0} sub="Needs attention" color="bg-yellow-50"/>
        <StatCard icon={<CheckCircle size={22} className="text-purple-600"/>} label="Delivered" value={stats?.deliveredOrders || 0} sub="Completed" color="bg-purple-50"/>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label:'Add Product', to:'/admin/products', icon:<Package size={20}/>, color:'bg-primary text-white' },
          { label:'View Orders', to:'/admin/orders', icon:<ShoppingBag size={20}/>, color:'bg-indigo-600 text-white' },
          { label:'View Messages', to:'/admin/contacts', icon:<TrendingUp size={20}/>, color:'bg-teal-600 text-white' },
        ].map(({ label, to, icon, color }) => (
          <Link key={label} to={to} className={`flex items-center gap-3 ${color} rounded-xl p-4 font-body text-sm font-bold uppercase tracking-widest hover:opacity-90 transition shadow-sm`}>
            {icon}{label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display text-lg font-bold text-primary">Recent Orders</h2>
          <Link to="/admin/orders" className="font-body text-xs font-bold text-muted hover:text-primary transition">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Order ID','Customer','Items','Total','Status','Date'].map(h=><th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>)}</tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3"><Link to={`/admin/orders/${o._id}`} className="font-body text-xs font-bold text-primary hover:underline">#{o._id.slice(-8).toUpperCase()}</Link></td>
                  <td className="px-4 py-3 font-body text-xs text-gray-600">{o.user?.name || o.guestEmail || 'Guest'}</td>
                  <td className="px-4 py-3 font-body text-xs text-gray-600">{o.items?.length}</td>
                  <td className="px-4 py-3 font-body text-xs font-bold text-gray-800">₹{o.totalPrice?.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`badge ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'} capitalize text-[10px]`}>{o.orderStatus?.replace('_',' ')}</span></td>
                  <td className="px-4 py-3 font-body text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <div className="text-center py-12 font-body text-sm text-gray-400">No orders yet</div>}
        </div>
      </div>
    </div>
  )
}
