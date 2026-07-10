import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, ChevronDown, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const STATUS_COLORS = {
  placed:'bg-blue-100 text-blue-700', confirmed:'bg-indigo-100 text-indigo-700',
  processing:'bg-yellow-100 text-yellow-700', shipped:'bg-purple-100 text-purple-700',
  delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700',
  refund_requested:'bg-orange-100 text-orange-700', refunded:'bg-gray-100 text-gray-600'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 15 })
    if (statusFilter) params.set('status', statusFilter)
    const { data } = await api.get(`/orders?${params}`)
    setOrders(data.orders || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this cancelled order?')) return
    try {
      await api.delete(`/orders/${id}`)
      toast.success('Order deleted successfully')
      fetchOrders()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete order')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Orders</h1>
          <p className="font-body text-sm text-gray-400">{total} total orders</p>
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="input-field text-sm pr-8 appearance-none cursor-pointer">
            <option value="">All Status</option>
            {['placed','confirmed','processing','shipped','delivered','cancelled','refund_requested','refunded'].map(s =>
              <option key={s} value={s}>{s.replace('_',' ')}</option>
            )}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID','Customer','Items','Total','Payment','Status','Date',''].map(h=>
                  <th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(10)].map((_,i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-8 animate-shimmer rounded"/></td></tr>
              )) : orders.map(o => (
                <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-body text-xs font-bold text-primary">#{o._id.slice(-8).toUpperCase()}</div>
                    <div className="font-body text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'})}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-body text-xs font-semibold text-gray-700">{o.user?.name || 'Guest'}</div>
                    <div className="font-body text-[10px] text-gray-400">{o.user?.email || o.guestEmail || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-gray-600">{o.items?.length} items</td>
                  <td className="px-4 py-3 font-body text-xs font-bold text-gray-800">₹{o.totalPrice?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="badge text-[9px] bg-gray-100 text-gray-600 capitalize">{o.paymentMethod === 'cod' ? 'COD' : 'Online'}</span>
                    <div className={`font-body text-[9px] mt-0.5 font-semibold ${o.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{o.paymentStatus}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[9px] ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'} capitalize`}>{o.orderStatus?.replace('_',' ')}</span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/orders/${o._id}`} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition">
                        <Eye size={13}/>
                      </Link>
                      {o.orderStatus === 'cancelled' && (
                        <button onClick={() => handleDelete(o._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition">
                          <Trash2 size={13}/>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="text-center py-16 font-body text-sm text-gray-400">No orders found</div>
          )}
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="font-body text-xs text-gray-400">Showing {(page-1)*15+1}–{Math.min(page*15, total)} of {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-outline text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page*15 >= total} className="btn-outline text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
