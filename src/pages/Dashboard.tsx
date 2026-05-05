import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { User, ShoppingBag, Heart, Bell, Settings, LogOut, LayoutGrid, PackagePlus } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Sneaker, Review, Order, UserRole } from '../types';
import { orderService, userService, notifyService, AppNotification, formatDate, collectionService, sneakerService } from '../services/dbService';
import { Collection as ProductCollection } from '../types';

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
          <p className="font-bold text-lg text-white">{formatDate(profile?.createdAt)}</p>
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
                    <p className="font-bold text-xs text-white">{formatDate(order.createdAt)}</p>
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

const AdminSales = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching all orders:', error);
      }
      setLoading(false);
    };
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 font-bold uppercase tracking-[0.2em] animate-pulse">Analyzing Ledger...</div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">Revenue Intelligence</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white text-black p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Gross Revenue</p>
          <p className="text-4xl font-black italic">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-stone-900 text-white p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Executed Orders</p>
          <p className="text-4xl font-black italic">{paidOrders.length}</p>
        </div>
        <div className="bg-stone-900 text-white p-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Awaiting Clearance</p>
          <p className="text-4xl font-black italic">{pendingOrders.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-black uppercase tracking-tighter text-2xl">Global Transaction Log</h3>
        <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-stone-500">
                <th className="p-6">Reference</th>
                <th className="p-6">Customer UID</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status</th>
                <th className="p-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold text-xs">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-mono text-stone-400">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="p-6 text-stone-500">{order.userId.slice(0, 8)}...</td>
                  <td className="p-6 text-white">${order.totalAmount}</td>
                  <td className="p-6">
                    <span className={`px-2 py-1 rounded-full text-[8px] uppercase tracking-widest font-black ${
                      order.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                      'bg-white/10 text-stone-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-stone-600">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 font-bold uppercase tracking-[0.2em] animate-pulse">Scanning Bio-Profiles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">User Hierarchy</h2>
      <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-stone-500">
              <th className="p-6">Identity</th>
              <th className="p-6">Email Address</th>
              <th className="p-6">Permissions</th>
              <th className="p-6">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-bold text-xs text-white">
            {users.map(u => (
              <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                <td className="p-6 font-black italic uppercase tracking-widest">{u.displayName}</td>
                <td className="p-6 text-stone-400">{u.email}</td>
                <td className="p-6">
                  <span className={`px-2 py-1 rounded-full text-[8px] uppercase tracking-widest font-black ${
                    u.role === UserRole.ADMIN ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-stone-400'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-6 text-stone-600">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Notifications = () => {
  const { user } = useApp();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const data = await notifyService.getByUser(user.uid);
          setNotifications(data || []);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id: string) => {
    await notifyService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 font-bold uppercase tracking-[0.2em] animate-pulse">Syncing Transmissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">Communications</h2>
      {notifications.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-16 text-center">
          <Bell size={48} className="mx-auto text-stone-800 mb-8" />
          <p className="font-bold text-stone-500 uppercase tracking-widest text-xs">Signal clear. No new notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`bg-white/5 border p-6 flex justify-between items-start transition-all ${
                notif.read ? 'border-white/5 opacity-50' : 'border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h4 className="font-black italic uppercase tracking-widest text-sm text-white">{notif.title}</h4>
                  {!notif.read && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                </div>
                <p className="text-stone-400 text-xs font-medium leading-relaxed">{notif.message}</p>
                <p className="text-[9px] font-black uppercase text-stone-600 tracking-widest">
                  {formatDate(notif.createdAt)}
                </p>
              </div>
              {!notif.read && (
                <button 
                  onClick={() => handleMarkRead(notif.id)}
                  className="text-[9px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
                >
                  Confirm Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminCollections = () => {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionService.getAll();
        setCollections(data || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
      setLoading(false);
    };
    fetchCollections();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    await collectionService.add({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
    });
    
    setShowAddForm(false);
    const data = await collectionService.getAll();
    setCollections(data || []);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      await collectionService.delete(id);
      setCollections(prev => prev.filter(c => c.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone-500 font-bold uppercase tracking-[0.2em] animate-pulse">Reconfiguring Archives...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Collection Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white text-black px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-stone-200"
        >
          {showAddForm ? 'Cancel' : 'New Collection'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-stone-900 border border-white/10 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="title" placeholder="Collection Title" className="bg-black border border-white/10 p-4 text-white font-bold" required />
          <input name="category" placeholder="Slug/Category (e.g. basketball)" className="bg-black border border-white/10 p-4 text-white font-bold" required />
          <input name="image" placeholder="Cover Image URL" className="bg-black border border-white/10 p-4 text-white font-bold md:col-span-2" required />
          <textarea name="description" placeholder="Short description..." className="bg-black border border-white/10 p-4 text-white font-bold md:col-span-2 h-24" required></textarea>
          <button type="submit" className="md:col-span-2 bg-white text-black py-4 font-black uppercase italic tracking-widest text-xs">Create Collection</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map(c => (
          <div key={c.id} className="bg-stone-900 border border-white/10 p-8 flex justify-between items-center">
            <div>
              <h3 className="font-black uppercase italic text-xl text-white">{c.title}</h3>
              <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">{c.category}</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-red-500 font-black uppercase text-[10px] tracking-widest hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSneaker, setEditingSneaker] = useState<any>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const sneakerData = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      description: formData.get('description') as string,
      categories: [formData.get('category') as string],
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'], // Default image
      sizes: [7, 8, 9, 10, 11, 12],
      isNewArrival: true,
    };

    try {
      if (editingSneaker && editingSneaker.id && !editingSneaker.id.startsWith('mock-')) {
        await sneakerService.update(editingSneaker.id, sneakerData);
      } else {
        await sneakerService.add(sneakerData);
      }
      alert(editingSneaker ? 'Alteration committed successfully' : 'Product successfully added to the registry');
      setShowAddForm(false);
      setEditingSneaker(null);
    } catch (err) {
      console.error(err);
      alert('Registry entry failed. Check console.');
    }
  };

  const startEdit = (sneaker: any) => {
    setEditingSneaker(sneaker);
    setShowAddForm(true);
  };

  return (
    <div className="space-y-12">
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">Inventory Command</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        {[
          { label: 'Asset Valuation', value: '$248,500', icon: LayoutGrid },
          { label: 'Active Pipeline', value: '18 Units', icon: ShoppingBag },
          { label: 'Critical Stock', value: '3 SKU', icon: Bell }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8">
            <stat.icon className="text-red-500 mb-4" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-black italic tracking-tighter uppercase">{stat.value}</p>
          </div>
        ))}
      </div>

      {showAddForm ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-stone-900 border-2 border-white/20 p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-black italic uppercase tracking-tighter text-3xl text-white">
                {editingSneaker ? 'Alter Registry Entry' : 'New Asset Entry'}
              </h3>
              <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mt-2 font-mono">
                Encrypted Session Validated
              </p>
            </div>
            <button onClick={() => { setShowAddForm(false); setEditingSneaker(null); }} className="text-stone-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors border border-white/10 px-4 py-2">Abort</button>
          </div>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white block pl-1">
                Product Designation <span className="text-stone-600 ml-2 font-normal">(Model name: e.g. Air Max 90)</span>
              </label>
              <input 
                type="text" 
                name="name"
                defaultValue={editingSneaker?.name}
                placeholder="Product Identifier" 
                className="w-full bg-black border border-white/20 p-5 font-bold text-white outline-none focus:border-red-500 transition-all placeholder-stone-800" 
                required 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white block pl-1">
                Laboratory Brand <span className="text-stone-600 ml-2 font-normal">(Brand: e.g. Nike)</span>
              </label>
              <input 
                type="text" 
                name="brand"
                defaultValue={editingSneaker?.brand}
                placeholder="Manufacturer Source" 
                className="w-full bg-black border border-white/20 p-5 font-bold text-white outline-none focus:border-red-500 transition-all placeholder-stone-800" 
                required 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white block pl-1">
                Collection Category <span className="text-stone-600 ml-2 font-normal">(e.g. basketball, urban, signature)</span>
              </label>
              <select 
                name="category"
                defaultValue={editingSneaker?.category || (editingSneaker?.categories && editingSneaker.categories[0]) || 'signature'}
                className="w-full bg-black border border-white/20 p-5 font-bold text-white outline-none focus:border-red-500 transition-all"
                required
              >
                <option value="signature">Signature Series</option>
                <option value="basketball">Heritage Basketball</option>
                <option value="urban">Urban Expedition</option>
                <option value="limited">Limited Drops</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white block pl-1">
                Credit Valuation ($) <span className="text-stone-600 ml-2 font-normal">(Sale price)</span>
              </label>
              <input 
                type="number" 
                name="price"
                defaultValue={editingSneaker?.price}
                placeholder="0.00" 
                className="w-full bg-black border border-white/20 p-5 font-bold text-white outline-none focus:border-red-500 transition-all placeholder-stone-800" 
                required 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-white block pl-1">
                Inventory Density <span className="text-stone-600 ml-2 font-normal">(Stock quantity)</span>
              </label>
              <input 
                type="number" 
                name="stock"
                defaultValue={editingSneaker?.stock}
                placeholder="00" 
                className="w-full bg-black border border-white/20 p-5 font-bold text-white outline-none focus:border-red-500 transition-all placeholder-stone-800" 
                required 
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white block pl-1">
                Technical Specifications <span className="text-stone-600 ml-2 font-normal">(Description, materials, history)</span>
              </label>
              <textarea 
                name="description"
                defaultValue={editingSneaker?.description}
                placeholder="Describe the footwear architecture..." 
                className="w-full bg-black border border-white/20 p-5 font-bold text-white outline-none focus:border-red-500 transition-all h-40 placeholder-stone-800" 
                required
              ></textarea>
            </div>
            <button type="submit" className="md:col-span-2 bg-white text-black py-6 font-black uppercase italic text-sm tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3">
              <PackagePlus size={18} />
              {editingSneaker ? 'Commit Alteration' : 'Commit to Registry'}
            </button>
          </form>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <h3 className="font-black italic uppercase tracking-tighter text-2xl text-white">Current Assets</h3>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-3 bg-white text-black px-8 py-5 font-black uppercase italic text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-[0_0_25px_rgba(255,255,255,0.1)]"
            >
              <PackagePlus size={18} />
              <span>Manifest Entry</span>
            </button>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-stone-500">
                  <th className="p-6">Asset Name</th>
                  <th className="p-6">Lab</th>
                  <th className="p-6">Valuation</th>
                  <th className="p-6">Units</th>
                  <th className="p-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold text-xs text-white">
                {[
                  { id: 'mock-1', name: 'Velocity Prime X', brand: 'VELOX', price: 180, stock: 50, categories: ['signature'], description: 'High-speed urban performance footwear with carbon fiber plate.' },
                  { id: 'mock-2', name: 'Thunderbolt High', brand: 'ADIDAS', price: 210, stock: 12, categories: ['basketball'], description: 'Superior court grip and ankle stability for elite shooters.' }
                ].map((sneaker, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-black italic tracking-widest uppercase">{sneaker.name}</td>
                    <td className="p-6 text-stone-500">{sneaker.brand}</td>
                    <td className="p-6">${sneaker.price}</td>
                    <td className="p-6">{sneaker.stock}</td>
                    <td className="p-6">
                      <button 
                        onClick={() => startEdit(sneaker)}
                        className="text-stone-700 hover:text-white font-black uppercase tracking-widest underline transition-colors"
                      >
                        Alter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
            <SidebarLink to="/dashboard/sales" icon={LayoutGrid} active={location.pathname === '/dashboard/sales'}>Sales Intelligence</SidebarLink>
            <SidebarLink to="/dashboard/admin" icon={PackagePlus} active={location.pathname === '/dashboard/admin'}>Inventory</SidebarLink>
            <SidebarLink to="/dashboard/admin-collections" icon={LayoutGrid} active={location.pathname === '/dashboard/admin-collections'}>Collections</SidebarLink>
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
          <Route path="notifications" element={<Notifications />} />
          {isAdmin && (
            <>
              <Route path="sales" element={<AdminSales />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin-collections" element={<AdminCollections />} />
              <Route path="users" element={<AdminUsers />} />
            </>
          )}
          <Route path="*" element={<div className="font-bold text-stone-400 italic">Section coming soon...</div>} />
        </Routes>
      </div>
    </div>
  );
}
