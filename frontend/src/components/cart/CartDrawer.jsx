import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQty, removeFromCart, total, shipping, count } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setIsOpen(false)
    if (!user) navigate('/login?redirect=/checkout')
    else navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)}/>
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-cream z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/20">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary"/>
            <h2 className="font-display text-lg font-bold text-primary">Your Cart ({count})</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted hover:text-primary transition"><X size={20}/></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-gold/40"/>
              <p className="font-body text-muted">Your cart is empty</p>
              <button onClick={() => { setIsOpen(false); navigate('/products') }} className="btn-primary text-xs">Shop Now</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(item => (
                <div key={`${item._id}-${item.size}`} className="flex gap-3 py-3 border-b border-gold/10">
                  <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-primary truncate">{item.name}</p>
                    {item.size && <p className="font-body text-xs text-muted">Size: {item.size}</p>}
                    <p className="font-body text-sm font-bold text-primary mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item._id, item.size, item.qty - 1)} className="w-6 h-6 border border-gold/40 rounded flex items-center justify-center hover:bg-gold/10 transition"><Minus size={10}/></button>
                      <span className="font-body text-sm font-semibold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.size, item.qty + 1)} className="w-6 h-6 border border-gold/40 rounded flex items-center justify-center hover:bg-gold/10 transition"><Plus size={10}/></button>
                      <button onClick={() => removeFromCart(item._id, item.size)} className="ml-auto text-red-400 hover:text-red-600 transition"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-gold/20 bg-cream-dark">
            <div className="flex justify-between font-body text-sm mb-1">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body text-sm mb-3">
              <span className="text-muted">Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && <p className="font-body text-xs text-muted mb-3">Add ₹{(999 - total).toLocaleString()} more for free shipping</p>}
            <div className="flex justify-between font-body text-base font-bold text-primary border-t border-gold/20 pt-3 mb-4">
              <span>Total</span>
              <span>₹{(total + shipping).toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary text-sm py-3">Proceed to Checkout</button>
            <button onClick={() => { setIsOpen(false); navigate('/cart') }} className="w-full mt-2 font-body text-xs text-muted hover:text-primary transition">View Cart</button>
          </div>
        )}
      </div>
    </>
  )
}
