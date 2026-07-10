import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, User, MapPin, CreditCard, Trash2 } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const STATUSES = ['placed','confirmed','processing','shipped','delivered','cancelled','refund_requested','refunded']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => {
      setOrder(r.data.order)
      setNewStatus(r.data.order.orderStatus)
      setTrackingNumber(r.data.order.trackingNumber || '')
      setTrackingUrl(r.data.order.trackingUrl || '')
    }).finally(() => setLoading(false))
  }, [id])

  const updateStatus = async () => {
    setUpdating(true)
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus, trackingNumber, trackingUrl })
      setOrder(o => ({ ...o, orderStatus: newStatus, trackingNumber, trackingUrl }))
      toast.success('Order updated!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setUpdating(false) }
  }

  const deleteOrder = async () => {
    if (!confirm('Are you sure you want to permanently delete this cancelled order?')) return
    setUpdating(true)
    try {
      await api.delete(`/orders/${id}`)
      toast.success('Order deleted')
      navigate('/admin/orders')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete')
      setUpdating(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>
  if (!order) return <div className="text-center py-16 text-gray-400">Order not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <ArrowLeft size={16}/>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="font-body text-sm text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Items + Customer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-gray-400"/>
              <h3 className="font-body text-sm font-bold uppercase tracking-widest text-gray-500">Order Items</h3>
            </div>
            <div className="space-y-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-100"/>
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-gray-800">{item.name}</p>
                    {item.size && <p className="font-body text-xs text-gray-400">Size: {item.size}</p>}
                    <p className="font-body text-xs text-gray-400 mt-0.5">₹{item.price} × {item.quantity}</p>
                  </div>
                  <span className="font-body text-sm font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-gray-400"/>
              <h3 className="font-body text-sm font-bold uppercase tracking-widest text-gray-500">Customer Info</h3>
            </div>
            <div className="space-y-2 font-body text-sm">
              <div><span className="text-gray-400">Name:</span> <span className="font-semibold text-gray-800">{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</span></div>
              <div><span className="text-gray-400">Email:</span> <span className="text-gray-800">{order.user?.email || order.guestEmail || 'N/A'}</span></div>
              <div><span className="text-gray-400">Phone:</span> <span className="text-gray-800">{order.shippingAddress?.phone || 'N/A'}</span></div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-gray-400"/>
              <h3 className="font-body text-sm font-bold uppercase tracking-widest text-gray-500">Shipping Address</h3>
            </div>
            <div className="font-body text-sm text-gray-600 leading-relaxed">
              <p className="font-semibold text-gray-800">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
            </div>
          </div>
        </div>

        {/* Right: Summary + Status */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-gray-400"/>
              <h3 className="font-body text-sm font-bold uppercase tracking-widest text-gray-500">Payment Summary</h3>
            </div>
            <div className="space-y-2 font-body text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${order.shippingPrice}`}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>–₹{order.discountAmount}</span></div>}
              <div className="flex justify-between font-bold text-base text-gray-800 border-t border-gray-100 pt-2"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
            </div>
            <div className="space-y-1 pt-3 border-t border-gray-100">
              <div className="flex justify-between font-body text-xs"><span className="text-gray-400">Payment Method</span><span className="font-semibold capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</span></div>
              <div className="flex justify-between font-body text-xs"><span className="text-gray-400">Payment Status</span><span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></div>
              {order.razorpayPaymentId && <div className="flex justify-between font-body text-xs"><span className="text-gray-400">Payment ID</span><span className="font-mono text-[10px]">{order.razorpayPaymentId.slice(0,20)}...</span></div>}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-body text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Update Order Status</h3>
            <div className="space-y-3">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Order Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field text-sm">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </div>
              {['shipped','delivered'].includes(newStatus) && (
                <>
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Tracking Number</label>
                    <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="input-field text-sm" placeholder="Enter tracking number"/>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-gray-500 block mb-1.5">Tracking URL</label>
                    <input value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} className="input-field text-sm" placeholder="https://..."/>
                  </div>
                </>
              )}
              <button onClick={updateStatus} disabled={updating} className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2">
                {updating ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Updating...</> : 'Update Status'}
              </button>
            </div>
          </div>

          {order.orderStatus === 'cancelled' && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-6 text-center">
              <h3 className="font-body text-sm font-bold text-red-800 mb-2">Delete Order</h3>
              <p className="font-body text-xs text-red-600 mb-4">This action is permanent and cannot be undone.</p>
              <button onClick={deleteOrder} disabled={updating} className="btn-primary bg-red-600 hover:bg-red-700 w-full text-sm py-2.5 flex items-center justify-center gap-2">
                <Trash2 size={15}/> {updating ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
