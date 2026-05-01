import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { User, ShoppingBag, Heart, Bell, Settings, LogOut, LayoutGrid, PackagePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Sneaker, Review, Order, UserRole } from '../types';
import { orderService } from '../services/dbService';

const SidebarLink = ({ to, icon: Icon, children, active }: { to: string, icon: any, children: React.ReactNode, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-6 py-4 font-bold uppercase text-xs tracking-widest transition-all ${active ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`}
  >
    <Icon size={18} />
    <span>{children}</span>
  </Link>
);

const Profile = () => {
  const { profile } = useApp();
  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8">
          <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest block mb-1">Email</label>
          <p className="font-bold text-lg text-white">{profile?.email}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest block mb-1">Full Name</label>
          <p className="font-bold text-lg text-white">{profile?.displayName}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest block mb-1">Account Type</label>
          <p className="font-bold text-lg uppercase tracking-tighter italic text-white">{profile?.role}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-8">
          <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest block mb-1">Member Since</label>
          <p className="font-bold text-lg text-white">{new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await orderService.getByUser(user.uid);
          setOrders(data || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 font-bold uppercase tracking-[0.2em] animate-pulse">Loading Archive...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Order Archive</h2>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 pb-2">{orders.length} Records</span>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-16 text-center">
          <ShoppingBag size={48} className="mx-auto text-stone-800 mb-8" />
          <p className="font-bold text-stone-500 uppercase tracking-widest text-xs mb-8">No order history found</p>
          <Link to="/products" className="inline-block bg-white text-black px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-stone-200 transition-colors">Start Buying</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-white/5 border border-white/10 p-8 hover:border-white/20 transition-all group">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-white/10 pb-6 mb-6">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[9px] font-black uppercase text-stone-600 tracking-widest mb-1">ID Ref</p>
                    <p className="font-mono text-xs text-white">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-stone-600 tracking-widest mb-1">Date</p>
                    <p className="font-bold text-xs text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                    order.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                    'bg-white/10 text-white'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-stone-300">
                        {item.name} 
                        <span className="ml-2 text-stone-600 font-black">SZ {item.size}</span>
                        <span className="ml-2 text-stone-700">x{item.quantity}</span>
                      </span>
                    </div>
                    <span className="font-black text-white">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <span className="font-black uppercase tracking-widest text-[9px] text-stone-600">Total Transaction</span>
                <span className="text-2xl font-black italic text-white">${order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product added successfully (Preview Only)');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">Inventory Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Sales', value: '$12,450', icon: LayoutGrid },
          { label: 'Active Orders', value: '18', icon: ShoppingBag },
          { label: 'Low Stock', value: '3 Items', icon: Bell }
        ].map((stat, i) => (
          <div key={i} className="bg-stone-950 p-8 text-white">
            <stat.icon className="text-red-500 mb-4" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black italic">{stat.value}</p>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-stone-50 p-8 border border-stone-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black uppercase tracking-tighter text-2xl">New Sneaker</h3>
            <button onClick={() => setShowAddForm(false)} className="text-stone-400 font-bold uppercase text-xs">Cancel</button>
          </div>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Product Name" className="p-4 border border-stone-200 font-bold" required />
            <input type="text" placeholder="Brand" className="p-4 border border-stone-200 font-bold" required />
            <input type="number" placeholder="Price" className="p-4 border border-stone-200 font-bold" required />
            <input type="number" placeholder="Stock" className="p-4 border border-stone-200 font-bold" required />
            <textarea placeholder="Description" className="p-4 border border-stone-200 font-bold md:col-span-2 h-32" required></textarea>
            <button type="submit" className="md:col-span-2 bg-stone-900 text-white py-4 font-black uppercase">Save Product</button>
          </form>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-between items-end">
            <h3 className="font-black uppercase tracking-tighter text-2xl">Products</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-stone-900 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-red-600 transition-colors"
            >
              <PackagePlus size={16} />
              <span>Add Sneaker</span>
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] font-black uppercase tracking-widest text-stone-500">
                <th className="pb-4">Product</th>
                <th className="pb-4">Brand</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-bold text-sm">
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-4 font-black">Velocity Prime X</td>
                <td className="py-4">VELOX</td>
                <td className="py-4">$180</td>
                <td className="py-4">50</td>
                <td className="py-4 text-stone-400 hover:text-stone-900 cursor-pointer underline">Edit</td>
              </tr>
              <tr className="hover:bg-stone-50 transition-colors">
                <td className="py-4 font-black">Thunderbolt High</td>
                <td className="py-4">ADIDAS</td>
                <td className="py-4">$210</td>
                <td className="py-4">12</td>
                <td className="py-4 text-stone-400 hover:text-stone-900 cursor-pointer underline">Edit</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { profile, loading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-stone-500 font-bold uppercase tracking-[0.3em] animate-pulse">Initializing Dashboard...</div>
    </div>
  );
  if (!profile) {
    navigate('/auth');
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const isAdmin = profile.role === UserRole.ADMIN;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-16">
      {/* Dashboard Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
        <SidebarLink to="/dashboard" icon={User} active={location.pathname === '/dashboard'}>Profile</SidebarLink>
        <SidebarLink to="/dashboard/orders" icon={ShoppingBag} active={location.pathname === '/dashboard/orders'}>Orders</SidebarLink>
        <SidebarLink to="/wishlist" icon={Heart} active={false}>Wishlist</SidebarLink>
        <SidebarLink to="/dashboard/notifications" icon={Bell} active={location.pathname === '/dashboard/notifications'}>Notifications</SidebarLink>
        {isAdmin && (
          <div className="pt-8 mt-8 border-t border-stone-100">
            <p className="px-6 mb-4 text-[10px] font-black uppercase text-stone-300 tracking-[0.2em]">ADMIN COMMAND</p>
            <SidebarLink to="/dashboard/admin" icon={LayoutGrid} active={location.pathname === '/dashboard/admin'}>Inventory</SidebarLink>
            <SidebarLink to="/dashboard/users" icon={User} active={location.pathname === '/dashboard/users'}>User Management</SidebarLink>
          </div>
        )}
        <div className="pt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-4 font-bold uppercase text-xs tracking-widest text-red-600 hover:bg-red-50 w-full text-left transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 min-h-[60vh]">
        <Routes>
          <Route index element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          {isAdmin && <Route path="admin" element={<AdminDashboard />} />}
          <Route path="*" element={<div className="font-bold text-stone-400 italic">Section coming soon...</div>} />
        </Routes>
      </div>
    </div>
  );
}
