import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-cream">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display mb-2">
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-70">Khatu Walas</div>
              <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>Creation</div>
            </div>
            <p className="font-body text-sm opacity-65 leading-relaxed italic max-w-xs mt-3">
              Devotion in every stitch. Handcrafted divine attire for Radha Krishna & Laddu Gopal.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com/khatuwalascreation" target="_blank" rel="noreferrer" className="w-8 h-8 border border-gold/30 rounded flex items-center justify-center hover:border-gold transition text-gold/80 hover:text-gold">
                <Instagram size={14}/>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-8 h-8 border border-gold/30 rounded flex items-center justify-center hover:border-gold transition text-gold/80 hover:text-gold">
                <MessageCircle size={14}/>
              </a>
              <a href="mailto:khatuwalacreation.com" className="w-8 h-8 border border-gold/30 rounded flex items-center justify-center hover:border-gold transition text-gold/80 hover:text-gold">
                <Mail size={14}/>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-4">Shop</h4>
            <div className="flex flex-col gap-2.5">
              {['radha-krishna','laddu-gopal','accessories','puja-items','khatu-shyam-baba'].map(c => (
                <Link key={c} to={`/products?category=${c}`} className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition capitalize">{c.replace('-',' ')}</Link>
              ))}
              <Link to="/products" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">All Products</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-4">Information</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/about" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">About Us</Link>
              <Link to="/contact" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">Contact</Link>
              <Link to="/faq" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">FAQ</Link>
              <Link to="/policies/shipping" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">Shipping Policy</Link>
              <Link to="/policies/refund" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">Refund Policy</Link>
              <Link to="/policies/privacy" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">Privacy Policy</Link>
              <Link to="/policies/terms" className="font-body text-xs opacity-65 hover:opacity-100 hover:text-gold transition">Terms of Service</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-start gap-2 opacity-65 hover:opacity-100 transition">
                <Phone size={13} className="mt-0.5 flex-shrink-0 text-gold"/>
                <span className="font-body text-xs">+91 98765 43210</span>
              </a>
              <a href="mailto:hello@khatuwalascreation.com" className="flex items-start gap-2 opacity-65 hover:opacity-100 transition">
                <Mail size={13} className="mt-0.5 flex-shrink-0 text-gold"/>
                <span className="font-body text-xs">hello@khatuwalascreation.com</span>
              </a>
              <div className="flex items-start gap-2 opacity-65">
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gold"/>
                <span className="font-body text-xs">Punjab, India</span>
              </div>
            </div>
            <div className="mt-4 p-3 border border-gold/20 rounded">
              <div className="font-body text-[10px] font-bold tracking-widest uppercase text-gold mb-1">Hours</div>
              <div className="font-body text-xs opacity-65">Mon–Sat: 9am – 8pm</div>
              <div className="font-body text-xs opacity-65">Sunday: 10am – 5pm</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/15 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs opacity-40">© {new Date().getFullYear()} Khatu Walas Creation. All rights reserved.</p>
          <p className="font-body text-xs opacity-40">Made with 🙏 devotion &nbsp;|&nbsp; @khatuwalascreation</p>
        </div>
      </div>
    </footer>
  )
}
