import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, AppProvider } from './context/AppContext';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Collections from './pages/Collections';
import Support from './pages/Support';

const Navbar = () => {
  const { cart, user, profile } = useApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-4 md:px-10 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-3xl font-serif italic tracking-tighter font-bold hover:opacity-80 transition-opacity">
          VELOCITY
        </Link>
        
        <div className="hidden md:flex space-x-10 font-bold uppercase text-[10px] tracking-[0.2em] text-stone-400">
          <Link to="/products" className="hover:text-white transition-colors">New Arrivals</Link>
          <Link to="/products?category=men" className="hover:text-white transition-colors">Men</Link>
          <Link to="/products?category=women" className="hover:text-white transition-colors">Women</Link>
          <Link to="/products?category=brands" className="hover:text-white transition-colors">Brands</Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex relative items-center bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Search size={16} className="text-stone-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:ring-0 text-xs w-32 ml-2 placeholder-stone-600 outline-none text-white"
            />
          </div>
          <Link to="/wishlist" className="text-stone-400 hover:text-white transition-colors">
            <div className="relative">
              <Heart size={20} strokeWidth={1.5} />
              {profile?.wishlist && profile.wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold px-1 rounded-full">
                  {profile.wishlist.length}
                </span>
              )}
            </div>
          </Link>
          <Link to="/cart" className="relative text-stone-400 hover:text-white transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold px-1 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          <Link to={user ? "/dashboard" : "/auth"} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/10 text-white text-[10px] font-bold hover:bg-white/20 transition-all">
            {user ? user.displayName?.split(' ').map(n=>n[0]).join('') || 'U' : <User size={14} />}
          </Link>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <Menu size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col p-10"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-3xl font-serif italic italic font-bold">VELOCITY</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col space-y-10 text-5xl font-serif italic tracking-tighter">
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>Signature Series</Link>
              <Link to="/products?category=men" onClick={() => setIsMenuOpen(false)}>Men</Link>
              <Link to="/products?category=women" onClick={() => setIsMenuOpen(false)}>Women</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-stone-700">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </main>
          <footer className="bg-[#0a0a0a] border-t border-white/10 py-16 px-6 md:px-10 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
              <div className="md:col-span-2">
                <Link to="/" className="text-3xl font-serif italic font-bold mb-8 block">VELOCITY</Link>
                <p className="max-w-xs text-stone-500 text-sm leading-relaxed mb-10 font-medium">Premium footwear engineering for the elite explorer. Defined by speed, crafted for the future.</p>
                <div className="flex space-x-6">
                  {['GL', 'TW', 'IG'].map(s => (
                    <div key={s} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-bold text-stone-500 hover:border-white hover:text-white transition-all cursor-pointer">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Collections</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                  <li><Link to="/products" className="hover:text-white cursor-pointer transition-colors">Signature Series</Link></li>
                  <li><Link to="/products?category=basketball" className="hover:text-white cursor-pointer transition-colors">Heritage Basketball</Link></li>
                  <li><Link to="/products?category=urban" className="hover:text-white cursor-pointer transition-colors">Urban Expedition</Link></li>
                  <li><Link to="/collections" className="hover:text-white cursor-pointer transition-colors">Limited Drops</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-8">Support</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-stone-500">
                  <li><Link to="/dashboard/orders" className="hover:text-white cursor-pointer transition-colors">Track Orders</Link></li>
                  <li><Link to="/support#privacy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/support#shipping" className="hover:text-white cursor-pointer transition-colors">Global Logistics</Link></li>
                  <li><Link to="/support" className="hover:text-white cursor-pointer transition-colors">Concierge</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto h-12 bg-white flex items-center justify-between px-6 md:px-10 mt-20 shrink-0 text-black">
              <div className="flex items-center space-x-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Checkout via Paystack</span>
                <div className="flex space-x-1">
                  <div className="w-5 h-3 bg-blue-600 rounded-sm"></div>
                  <div className="w-5 h-3 bg-red-600 rounded-sm"></div>
                </div>
              </div>
              <div className="flex space-x-8 text-[9px] font-black uppercase tracking-[0.2em]">
                <span className="hidden sm:inline text-stone-500">Free Global Shipping on orders over $150</span>
                <span className="flex items-center text-stone-900">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  Server Status: Optimal
                </span>
              </div>
            </div>
          </footer>
        </div>
      </AppProvider>
    </Router>
  );
}
