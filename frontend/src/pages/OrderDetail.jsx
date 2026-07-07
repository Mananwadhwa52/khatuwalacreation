import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, MapPin, ExternalLink, AlertCircle } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_STEPS = ['placed','confirmed','processing','shipped','delivered']
const STATUS_COLORS = {
  placed:'bg-blue-100 text-blue-700', confirmed:'bg-indigo-100 text-indigo-700',
  processing:'bg-yellow-100 text-yellow-700', shipped:'bg-purple-100 text-purple-700',
  delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700',
  refund_requested:'bg-orange-100 text-orange-700', refunded:'bg-gray-100 text-gray-600',
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refundModal, setRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setActionLoading(true)
    try {
      await api.post(`/orders/${id}/cancel`)
      setOrder(o => ({ ...o, orderStatus: 'cancelled' }))
      toast.success('Order cancelled')
    } catch (e) { toast.error(e.response?.data?.message || 'Cannot cancel') }
    finally { setActionLoading(false) }
  }

  const handleRefund = async () => {
    if (!refundReason.trim()) return toast.error('Please provide a reason')
    setActionLoading(true)
    try {
      await api.post(`/orders/${id}/refund`, { reason: refundReason })
      setOrder(o => ({ ...o, orderStatus: 'refund_requested' }))
      setRefundModal(false)
      toast.success('Refund requested! We will process within 5-7 business days.')
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to request refund') }
    finally { setActionLoading(false) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center mandala-bg"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>
  if (!order) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Order not found</p></div>

  const stepIdx = STATUS_STEPS.indexOf(order.orderStatus)
  const canCancel = ['placed','confirmed'].includes(order.orderStatus)
  const canRefund = ['delivered','processing','confirmed'].includes(order.orderStatus)

  return (
    <div className="min-h-screen mandala-bg page-enter py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/orders" className="font-body text-xs text-muted hover:text-primary transition">← My Orders</Link>
          <h1 className="font-display text-2xl font-bold text-primary">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100'} capitalize ml-auto`}>{order.orderStatus?.replace('_',' ')}</span>
        </div>

        {/* Progress bar */}
        {!['cancelled','refund_requested','refunded'].includes(order.orderStatus) && (
          <div className="bg-cream rounded-xl border border-gold/20 p-6 mb-6 shadow-sm">
            <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-5">Order Progress</h3>
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition ${i <= stepIdx ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < stepIdx ? <CheckCircle size={16}/> : i+1}
                  </div>
                  <span className="font-body text-[10px] text-center text-muted capitalize hidden sm:block">{s}</span>
                  {i < STATUS_STEPS.length - 1 && <div className={`absolute w-full h-0.5 top-4 left-1/2 ${i < stepIdx ? 'bg-gold' : 'bg-gray-200'}`}/>}
                </div>
              ))}
            </div>
            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-cream-dark rounded border border-gold/15">
                <p className="font-body text-xs font-bold text-muted mb-1">Tracking Number: <span className="text-primary">{order.trackingNumber}</span></p>
                {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="font-body text-xs text-gold hover:underline flex items-center gap-1">Track Package <ExternalLink size={10}/></a>}
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-cream rounded-xl border border-gold/20 p-6 shadow-sm">
              <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-4">Items Ordered</h3>
              <div className="flex flex-col gap-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 border-b border-gold/10 pb-4 last:border-0 last:pb-0">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded border border-gold/10 flex-shrink-0"/>
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold text-primary">{item.name}</p>
                      {item.size && <p className="font-body text-xs text-muted">Size: {item.size}</p>}
                      <p className="font-body text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-cream rounded-xl border border-gold/20 p-6 shadow-sm">
              <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2"><MapPin size={13}/> Shipping Address</h3>
              <p className="font-body text-sm font-semibold text-primary">{order.shippingAddress?.fullName}</p>
              <p className="font-body text-sm text-muted">{order.shippingAddress?.phone}</p>
              <p className="font-body text-sm text-muted mt-1">{order.shippingAddress?.line1}{order.shippingAddress?.line2 ? ', '+order.shippingAddress.line2 : ''}</p>
              <p className="font-body text-sm text-muted">{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Summary + Actions */}
          <div className="space-y-4">
            <div className="bg-cream rounded-xl border border-gold/20 p-5 shadow-sm">
              <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-4">Order Summary</h3>
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${order.shippingPrice}`}</span></div>
                {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>–₹{order.discountAmount}</span></div>}
                <div className="flex justify-between font-bold text-primary text-base border-t border-gold/15 pt-2 mt-1"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gold/15 space-y-1">
                <div className="flex justify-between font-body text-xs"><span className="text-muted">Payment</span><span className="capitalize font-semibold text-primary">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></div>
                <div className="flex justify-between font-body text-xs"><span className="text-muted">Payment Status</span><span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-cream rounded-xl border border-gold/20 p-5 shadow-sm space-y-3">
              <h3 className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-2">Actions</h3>
              {canCancel && <button onClick={handleCancel} disabled={actionLoading} className="w-full border border-red-300 text-red-600 font-body text-xs font-semibold uppercase tracking-widest py-2.5 rounded hover:bg-red-50 transition">Cancel Order</button>}
              {canRefund && <button onClick={() => setRefundModal(true)} className="w-full border border-orange-300 text-orange-600 font-body text-xs font-semibold uppercase tracking-widest py-2.5 rounded hover:bg-orange-50 transition">Request Refund</button>}
              <Link to="/contact" className="w-full border border-gold/40 text-muted font-body text-xs font-semibold uppercase tracking-widest py-2.5 rounded hover:text-primary hover:border-primary transition flex items-center justify-center">Need Help?</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Refund modal */}
      {refundModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-cream rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={22} className="text-orange-500"/>
              <h3 className="font-display text-xl font-bold text-primary">Request Refund</h3>
            </div>
            <p className="font-body text-sm text-muted mb-4">Refunds are processed within 5-7 business days to your original payment method.</p>
            <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-2">Reason for Refund *</label>
            <textarea value={refundReason} onChange={e => setRefundReason(e.target.value)} rows={4} className="input-field mb-5 resize-none" placeholder="Please describe the issue..."/>
            <div className="flex gap-3">
              <button onClick={() => setRefundModal(false)} className="flex-1 btn-outline text-sm">Cancel</button>
              <button onClick={handleRefund} disabled={actionLoading} className="flex-1 btn-primary text-sm">{actionLoading ? 'Submitting...' : 'Submit Request'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
