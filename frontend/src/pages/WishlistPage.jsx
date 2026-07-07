// WishlistPage.jsx
import { useEffect, useState } from 'react'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
export function WishlistPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/auth/me').then(r => {
      const wishlist = r.data.user.wishlist || []
      setProducts(wishlist)
    }).finally(() => setLoading(false))
  }, [])
  if (loading) return <div className="min-h-screen flex items-center justify-center mandala-bg"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>
  return (
    <div className="min-h-screen mandala-bg page-enter py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-3xl font-bold text-primary mb-8">My Wishlist</h1>
        {products.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={56} className="text-gold/30 mx-auto mb-4"/>
            <h3 className="font-display text-2xl text-primary mb-2">Your wishlist is empty</h3>
            <p className="font-body text-muted mb-6">Save items you love for later</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
export default WishlistPage
