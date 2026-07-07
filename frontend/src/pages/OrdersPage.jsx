import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import api from '../utils/api'

const STATUS_COLORS = {
  placed:            'bg-blue-100 text-blue-700',
  confirmed:         'bg-indigo-100 text-indigo-700',
  processing:        'bg-yellow-100 text-yellow-700',
  shipped:           'bg-purple-100 text-purple-700',
  delivered:         'bg-green-100 text-green-700',
  cancelled:         'bg-red-100 text-red-700',
  refund_requested:  'bg-orange-100 text-orange-700',
  refunded:          'bg-gray-100 text-gray-600',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data.orders)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center mandala-bg"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>

  return (
    <div className="min-h-screen mandala-bg page-enter py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-display text-3xl font-bold text-primary mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <Package size={56} className="text-gold/40 mx-auto mb-4"/>
            <h3 className="font-display text-2xl text-primary mb-2">No orders yet</h3>
            <p className="font-body text-muted mb-6">Your divine journey begins with your first order</p>
            <Link to="/products" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="bg-cream rounded-xl border border-gold/20 p-5 shadow-sm hover:shadow-md hover:border-gold/40 transition block">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-body text-xs text-muted mb-0.5">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="font-body text-xs text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'} capitalize`}>{order.orderStatus?.replace('_',' ')}</span>
                    <ChevronRight size={16} className="text-muted"/>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3 overflow-hidden">
                  {order.items?.slice(0,3).map((item, i) => (
                    <img key={i} src={item.image || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded border border-gold/10 flex-shrink-0"/>
                  ))}
                  {order.items?.length > 3 && <span className="font-body text-xs text-muted">+{order.items.length - 3} more</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-muted">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  <span className="font-body text-base font-bold text-primary">₹{order.totalPrice?.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
