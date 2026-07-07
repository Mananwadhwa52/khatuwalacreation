import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total, shipping, count } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <div className="min-h-screen mandala-bg flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={64} className="text-gold/30 mx-auto mb-4"/>
        <h2 className="font-display text-3xl text-primary mb-3">Your cart is empty</h2>
        <p className="font-body text-muted mb-6">Add some divine creations to get started</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen mandala-bg page-enter py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-muted hover:text-primary transition"><ArrowLeft size={20}/></button>
          <h1 className="font-display text-3xl font-bold text-primary">Shopping Cart ({count})</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={`${item._id}-${item.size}`} className="bg-cream rounded-xl border border-gold/20 p-5 shadow-sm flex gap-4">
                <img src={item.image||'/placeholder.jpg'} alt={item.name} className="w-24 h-24 object-cover rounded-lg border border-gold/10 flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-body text-sm font-semibold text-primary leading-snug">{item.name}</h3>
                    <button onClick={() => removeFromCart(item._id, item.size)} className="text-red-400 hover:text-red-600 transition flex-shrink-0"><Trash2 size={15}/></button>
                  </div>
                  {item.size && <p className="font-body text-xs text-muted mt-0.5">Size: {item.size}</p>}
                  <p className="font-body text-sm font-bold text-primary mt-2">₹{item.price.toLocaleString()} each</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gold/30 rounded overflow-hidden">
                      <button onClick={() => updateQty(item._id, item.size, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gold/10 transition"><Minus size={12}/></button>
                      <span className="w-10 text-center font-body text-sm font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.size, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gold/10 transition"><Plus size={12}/></button>
                    </div>
                    <span className="font-body text-base font-bold text-primary ml-auto">₹{(item.price*item.qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-cream rounded-xl border border-gold/20 p-6 shadow-sm sticky top-24">
              <h3 className="font-display text-lg font-bold text-primary mb-5">Order Summary</h3>
              <div className="space-y-3 font-body text-sm mb-5">
                <div className="flex justify-between"><span className="text-muted">Subtotal ({count} items)</span><span>₹{total.toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className={shipping===0?'text-green-600 font-semibold':''}>{shipping===0?'FREE':`₹${shipping}`}</span>
                </div>
                {shipping>0 && <p className="text-xs text-muted bg-amber-50 p-2 rounded border border-amber-200">Add ₹{(999-total).toLocaleString()} more for free shipping!</p>}
              </div>
              <div className="border-t border-gold/20 pt-4 mb-5">
                <div className="flex justify-between font-display text-lg font-bold text-primary">
                  <span>Total</span><span>₹{(total+shipping).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => navigate(user ? '/checkout' : '/login?redirect=/checkout')} className="btn-primary w-full py-4 text-sm">
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              <Link to="/products" className="block text-center font-body text-xs text-muted hover:text-primary transition mt-3">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
