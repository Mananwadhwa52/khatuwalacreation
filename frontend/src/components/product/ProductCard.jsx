import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [wishlisted, setWishlisted] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const discount = product.mrp && product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : null

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to wishlist')
    try {
      await api.post(`/auth/wishlist/${product._id}`)
      setWishlisted(w => !w)
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    } catch { toast.error('Failed to update wishlist') }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success('Added to cart 🛍️')
  }

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="bg-cream rounded-lg overflow-hidden card-hover border border-gold/10 shadow-sm relative">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-cream-dark">
          <img
            src={product.images?.[imgIdx]?.url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.target.src = '/placeholder.jpg' }}
          />
          {/* Hover second image */}
          {product.images?.length > 1 && (
            <img
              src={product.images[1].url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && <span className="badge bg-primary text-white">-{discount}%</span>}
            {product.badges?.slice(0,1).map(b => <span key={b} className="badge bg-primary/90 text-white">{b}</span>)}
            {!product.inStock && <span className="badge bg-gray-500 text-white">Out of Stock</span>}
          </div>

          {/* Actions overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button onClick={handleWishlist} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition ${wishlisted ? 'bg-primary text-white' : 'bg-white text-muted hover:text-primary'}`}>
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'}/>
            </button>
          </div>

          {/* Quick add */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button onClick={handleAddToCart} className="w-full py-2.5 bg-primary text-cream text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-primary-dark transition">
                <ShoppingBag size={13}/> Quick Add
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted/60 mb-0.5 capitalize">{product.category?.replace('-', ' ')}</p>
          <h3 className="font-display text-sm font-semibold text-primary leading-snug line-clamp-2 mb-2">{product.name}</h3>
          
          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= Math.round(product.ratings) ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}/>)}
              <span className="font-body text-[10px] text-muted ml-1">({product.numReviews})</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-body text-base font-bold text-primary">₹{product.price.toLocaleString()}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="font-body text-xs text-muted line-through">₹{product.mrp.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
