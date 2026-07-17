import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'

// Pages
import HomePage       from './pages/HomePage'
import ProductsPage   from './pages/ProductsPage'
import ProductDetail  from './pages/ProductDetail'
import CartPage       from './pages/CartPage'
import CheckoutPage   from './pages/CheckoutPage'
import OrderSuccess   from './pages/OrderSuccess'
import OrdersPage     from './pages/OrdersPage'
import OrderDetail    from './pages/OrderDetail'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage    from './pages/ProfilePage'
import WishlistPage   from './pages/WishlistPage'
import ContactPage    from './pages/ContactPage'
import AboutPage      from './pages/AboutPage'
import ShippingPolicy from './pages/policies/ShippingPolicy'
import RefundPolicy   from './pages/policies/RefundPolicy'
import PrivacyPolicy  from './pages/policies/PrivacyPolicy'
import TermsPage      from './pages/policies/TermsPage'
import FAQPage        from './pages/FAQPage'

// Admin
import AdminLayout    from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts  from './pages/admin/AdminProducts'
import AdminOrders    from './pages/admin/AdminOrders'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import AdminContacts  from './pages/admin/AdminContacts'
import AdminCoupons   from './pages/admin/AdminCoupons'
import AdminUsers     from './pages/admin/AdminUsers'
import AdminSettings  from './pages/admin/AdminSettings'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>
  return user ? children : <Navigate to="/login" replace/>
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gold border-t-primary rounded-full animate-spin"/></div>
  return user?.role === 'admin' ? children : <Navigate to="/login" replace/>
}

function PublicLayout({ children }) {
  return <>
    <Navbar/>
    <CartDrawer/>
    <main>{children}</main>
    <Footer/>
  </>
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><HomePage/></PublicLayout>}/>
          <Route path="/products" element={<PublicLayout><ProductsPage/></PublicLayout>}/>
          <Route path="/products/:id" element={<PublicLayout><ProductDetail/></PublicLayout>}/>
          <Route path="/cart" element={<PublicLayout><CartPage/></PublicLayout>}/>
          <Route path="/about" element={<PublicLayout><AboutPage/></PublicLayout>}/>
          <Route path="/contact" element={<PublicLayout><ContactPage/></PublicLayout>}/>
          <Route path="/faq" element={<PublicLayout><FAQPage/></PublicLayout>}/>
          <Route path="/policies/shipping" element={<PublicLayout><ShippingPolicy/></PublicLayout>}/>
          <Route path="/policies/refund" element={<PublicLayout><RefundPolicy/></PublicLayout>}/>
          <Route path="/policies/privacy" element={<PublicLayout><PrivacyPolicy/></PublicLayout>}/>
          <Route path="/policies/terms" element={<PublicLayout><TermsPage/></PublicLayout>}/>
          <Route path="/login" element={<PublicLayout><LoginPage/></PublicLayout>}/>
          <Route path="/register" element={<PublicLayout><RegisterPage/></PublicLayout>}/>
          <Route path="/reset-password/:token" element={<PublicLayout><ResetPasswordPage/></PublicLayout>}/>

          {/* Protected */}
          <Route path="/checkout" element={<ProtectedRoute><PublicLayout><CheckoutPage/></PublicLayout></ProtectedRoute>}/>
          <Route path="/order-success/:id" element={<ProtectedRoute><PublicLayout><OrderSuccess/></PublicLayout></ProtectedRoute>}/>
          <Route path="/orders" element={<ProtectedRoute><PublicLayout><OrdersPage/></PublicLayout></ProtectedRoute>}/>
          <Route path="/orders/:id" element={<ProtectedRoute><PublicLayout><OrderDetail/></PublicLayout></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><PublicLayout><ProfilePage/></PublicLayout></ProtectedRoute>}/>
          <Route path="/wishlist" element={<ProtectedRoute><PublicLayout><WishlistPage/></PublicLayout></ProtectedRoute>}/>

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="products" element={<AdminProducts/>}/>
            <Route path="orders" element={<AdminOrders/>}/>
            <Route path="orders/:id" element={<AdminOrderDetail/>}/>
            <Route path="contacts" element={<AdminContacts/>}/>
            <Route path="coupons" element={<AdminCoupons/>}/>
            <Route path="users" element={<AdminUsers/>}/>
            <Route path="settings" element={<AdminSettings/>}/>
          </Route>

          <Route path="*" element={<PublicLayout><div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="font-display text-6xl text-primary mb-4">404</h1><p className="font-body text-muted mb-6">Page not found</p><a href="/" className="btn-primary">Go Home</a></div></div></PublicLayout>}/>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
