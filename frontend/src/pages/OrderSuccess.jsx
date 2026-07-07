import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react'
import api from '../utils/api'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).catch(() => {})
  }, [id])

  return (
    <div className="min-h-screen mandala-bg flex items-center justify-center py-16 px-6">
      <div className="max-w-lg w-full bg-cream rounded-2xl border border-gold/20 shadow-xl p-8 text-center page-enter">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600"/>
        </div>
        <h1 className="font-display text-3xl font-bold text-primary mb-2">Order Placed! 🙏</h1>
        <p className="font-body text-muted mb-1">Thank you for your order.</p>
        <p className="font-body text-sm text-muted mb-6">Order confirmation sent to your email.</p>

        {order && (
          <div className="bg-cream-dark rounded-xl p-5 mb-6 text-left border border-gold/15">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-xs font-bold uppercase tracking-widest text-muted">Order ID</span>
              <span className="font-body text-sm font-bold text-primary">#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-10 h-10 object-cover rounded"/>
                  <div className="flex-1">
                    <p className="font-body text-xs font-semibold text-primary">{item.name}</p>
                    <p className="font-body text-xs text-muted">Qty: {item.quantity} · ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gold/15 pt-3 space-y-1">
              <div className="flex justify-between font-body text-sm font-bold text-primary">
                <span>Total Paid</span>
                <span>₹{order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-xs text-muted">
                <span>Payment</span>
                <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="flex justify-between mb-8 px-4">
          {[
            { icon: <CheckCircle size={18}/>, label: 'Order Placed', done: true },
            { icon: <Package size={18}/>, label: 'Processing', done: false },
            { icon: <Truck size={18}/>, label: 'Shipped', done: false },
            { icon: <MapPin size={18}/>, label: 'Delivered', done: false },
          ].map(({ icon, label, done }, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{icon}</div>
              <span className="font-body text-[10px] text-muted">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/orders" className="btn-primary py-3 w-full">Track My Orders</Link>
          <Link to="/products" className="btn-outline py-3 w-full">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
