import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('kw_cart')) || [] } catch { return [] } })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => { localStorage.setItem('kw_cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (product, qty = 1, size = '') => {
    setCart(prev => {
      const key = `${product._id}-${size}`
      const ex = prev.find(i => `${i._id}-${i.size}` === key)
      if (ex) return prev.map(i => `${i._id}-${i.size}` === key ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { _id: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url, size, qty }]
    })
    setIsOpen(true)
  }

  const updateQty = (id, size, qty) => {
    if (qty < 1) return removeFromCart(id, size)
    setCart(prev => prev.map(i => i._id === id && i.size === size ? { ...i, qty } : i))
  }

  const removeFromCart = (id, size) => setCart(prev => prev.filter(i => !(i._id === id && i.size === size)))

  const clearCart = () => setCart([])

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const count    = cart.reduce((s, i) => s + i.qty, 0)
  const shipping = total >= 999 ? 0 : 99

  return <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total, count, shipping, isOpen, setIsOpen }}>
    {children}
  </CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
