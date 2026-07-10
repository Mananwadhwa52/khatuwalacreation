import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Shield, Truck, Tag, X } from 'lucide-react'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh']

export default function CheckoutPage() {
  const { cart, total, shipping, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1=address, 2=payment
  
  const savedAddresses = user?.addresses || []
  const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0]
  
  const [address, setAddress] = useState({ 
    fullName: defaultAddr?.fullName || user?.name || '', 
    phone: defaultAddr?.phone || '', 
    line1: defaultAddr?.line1 || '', 
    line2: defaultAddr?.line2 || '', 
    city: defaultAddr?.city || '', 
    state: defaultAddr?.state || '', 
    pincode: defaultAddr?.pincode || '' 
  })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [placing, setPlacing] = useState(false)

  const discount = couponApplied?.discount || 0
  const finalTotal = Math.max(total + shipping - discount, 0)

  const setAddr = (k, v) => setAddress(a => ({ ...a, [k]: v }))

  const validateAddress = () => {
    const required = ['fullName','phone','line1','city','state','pincode']
    for (const k of required) {
      if (!address[k].trim()) { toast.error(`Please fill in ${k.replace(/([A-Z])/g,' $1').toLowerCase()}`); return false }
    }
    if (!/^\d{10}$/.test(address.phone)) { toast.error('Enter valid 10-digit phone number'); return false }
    if (!/^\d{6}$/.test(address.pincode)) { toast.error('Enter valid 6-digit pincode'); return false }
    return true
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await api.post('/payment/apply-coupon', { code: couponCode, cartTotal: total })
      setCouponApplied(data)
      toast.success(data.message)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid coupon')
      setCouponApplied(null)
    } finally { setCouponLoading(false) }
  }

  const placeOrder = async () => {
    if (!validateAddress()) return
    setPlacing(true)
    try {
      const orderPayload = {
        items: cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, size: i.size, quantity: i.qty })),
        shippingAddress: address,
        couponCode: couponApplied?.couponCode || '',
        paymentMethod,
      }

      const { data } = await api.post('/payment/create-order', orderPayload)

      if (data.isCOD) {
        clearCart()
        navigate(`/order-success/${data.order._id}`)
        return
      }

      // Razorpay
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Khatu Walas Creation',
        description: 'Divine Attire Order',
        order_id: data.rzpOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            })
            clearCart()
            navigate(`/order-success/${verifyRes.data.order._id}`)
          } catch { toast.error('Payment verification failed. Contact support.') }
        },
        prefill: { name: address.fullName, contact: address.phone, email: user?.email },
        theme: { color: '#570000' },
        modal: { ondismiss: () => { setPlacing(false); toast.error('Payment cancelled') } },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create order')
      setPlacing(false)
    }
  }

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center mandala-bg">
      <div className="text-center"><h2 className="font-display text-2xl text-primary mb-4">Your cart is empty</h2><button onClick={() => navigate('/products')} className="btn-primary">Shop Now</button></div>
    </div>
  )

  return (
    <div className="min-h-screen mandala-bg page-enter py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-display text-3xl font-bold text-primary mb-8">Checkout</h1>

        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-10">
          {[['1','Shipping Address'],['2','Payment']].map(([n,label], i) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-bold transition ${step >= Number(n) ? 'bg-primary text-white' : 'bg-gray-200 text-muted'}`}>{n}</div>
              <span className={`font-body text-sm font-semibold ${step >= Number(n) ? 'text-primary' : 'text-muted'}`}>{label}</span>
              {i < 1 && <div className={`w-16 h-0.5 mx-2 ${step > Number(n) ? 'bg-gold' : 'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-cream rounded-xl border border-gold/20 p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold text-primary mb-6">Shipping Address</h2>
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-2">Saved Addresses</label>
                    <div className="flex flex-col gap-3">
                      {savedAddresses.map(addr => (
                        <div key={addr._id} onClick={() => setAddress({ fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode })} className="p-3 border border-gray-200 bg-white rounded-lg cursor-pointer hover:border-gold transition">
                          <p className="font-body text-sm font-bold text-primary">{addr.fullName} <span className="font-normal text-muted">— {addr.phone}</span></p>
                          <p className="font-body text-xs text-muted mt-1">{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 mb-4 font-body text-sm text-center text-muted">OR ENTER NEW ADDRESS</div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Full Name *</label>
                    <input value={address.fullName} onChange={e => setAddr('fullName', e.target.value)} className="input-field" placeholder="Your full name"/>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Phone *</label>
                    <input value={address.phone} onChange={e => setAddr('phone', e.target.value)} className="input-field" placeholder="10-digit mobile number" maxLength={10}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Address Line 1 *</label>
                    <input value={address.line1} onChange={e => setAddr('line1', e.target.value)} className="input-field" placeholder="House/Flat no, Street name"/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Address Line 2</label>
                    <input value={address.line2} onChange={e => setAddr('line2', e.target.value)} className="input-field" placeholder="Landmark, Area (optional)"/>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">City *</label>
                    <input value={address.city} onChange={e => setAddr('city', e.target.value)} className="input-field" placeholder="City"/>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">Pincode *</label>
                    <input value={address.pincode} onChange={e => setAddr('pincode', e.target.value)} className="input-field" placeholder="6-digit pincode" maxLength={6}/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-1.5">State *</label>
                    <select value={address.state} onChange={e => setAddr('state', e.target.value)} className="input-field">
                      <option value="">Select state</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => { if (validateAddress()) setStep(2) }} className="btn-primary mt-6 w-full py-4">Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-cream rounded-xl border border-gold/20 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-primary">Payment Method</h2>
                  <button onClick={() => setStep(1)} className="font-body text-xs text-muted hover:text-primary transition underline">Edit Address</button>
                </div>

                {/* Address summary */}
                <div className="bg-cream-dark rounded-lg p-4 mb-6 border border-gold/15">
                  <p className="font-body text-xs font-bold uppercase tracking-widest text-muted mb-1">Delivering to</p>
                  <p className="font-body text-sm font-semibold text-primary">{address.fullName} · {address.phone}</p>
                  <p className="font-body text-sm text-muted">{address.line1}{address.line2 ? ', '+address.line2 : ''}, {address.city}, {address.state} – {address.pincode}</p>
                </div>

                {/* Payment options */}
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { value: 'razorpay', label: 'Pay Online', desc: 'UPI, Cards, Net Banking via Razorpay', icon: <Shield size={20} className="text-blue-600"/> },
                    { value: 'cod',      label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: <Truck size={20} className="text-green-600"/> },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${paymentMethod === opt.value ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/40'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={e => setPaymentMethod(e.target.value)} className="accent-primary"/>
                      <div className="flex-shrink-0">{opt.icon}</div>
                      <div>
                        <div className="font-body text-sm font-bold text-primary">{opt.label}</div>
                        <div className="font-body text-xs text-muted">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <button onClick={placeOrder} disabled={placing} className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2">
                  {placing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Processing...</> : `Place Order · ₹${finalTotal.toLocaleString()}`}
                </button>
                <p className="font-body text-xs text-muted text-center mt-3 flex items-center justify-center gap-1"><Shield size={12}/> Secured by 256-bit SSL encryption</p>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="bg-cream rounded-xl border border-gold/20 p-6 shadow-sm sticky top-24">
              <h3 className="font-display text-lg font-bold text-primary mb-4">Order Summary</h3>

              {/* Cart items */}
              <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-3">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-semibold text-primary truncate">{item.name}</p>
                      {item.size && <p className="font-body text-xs text-muted">Size: {item.size}</p>}
                      <p className="font-body text-xs text-muted">Qty: {item.qty} · ₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-gold/15 pt-4 mb-4">
                <label className="font-body text-xs font-bold uppercase tracking-widest text-muted block mb-2">Coupon Code</label>
                {couponApplied ? (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                    <Tag size={14} className="text-green-600"/>
                    <span className="font-body text-xs font-semibold text-green-700 flex-1">{couponApplied.couponCode} – Save ₹{couponApplied.discount}</span>
                    <button onClick={() => { setCouponApplied(null); setCouponCode('') }}><X size={14} className="text-muted"/></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="input-field text-xs flex-1" placeholder="Enter code"/>
                    <button onClick={applyCoupon} disabled={couponLoading} className="btn-outline text-xs px-3 py-2 whitespace-nowrap">{couponLoading ? '...' : 'Apply'}</button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2 border-t border-gold/15 pt-4">
                <div className="flex justify-between font-body text-sm"><span className="text-muted">Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-muted">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                {discount > 0 && <div className="flex justify-between font-body text-sm text-green-600"><span>Coupon Discount</span><span>–₹{discount}</span></div>}
                <div className="flex justify-between font-display text-lg font-bold text-primary border-t border-gold/20 pt-2 mt-1"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
