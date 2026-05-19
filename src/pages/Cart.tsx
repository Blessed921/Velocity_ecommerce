import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { usePaystack } from '../hooks/usePaystack';
import { auth } from '../lib/firebase';
import { orderService, notifyService } from '../services/dbService';

export default function Cart() {
  const { cart, removeFromCart, clearCart, user } = useApp();
  const { initializePayment } = usePaystack();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    phone: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handlePaystackCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=cart');
      return;
    }

    initializePayment({
      email: user.email!,
      amount: total,
      onSuccess: async (response) => {
        console.log('Payment Successful', response);
        setIsVerifying(true);
        
        try {
          // Verify payment on our server
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: response.reference })
          });
          
          const result = await verifyRes.json();
          
          if (result.success) {
            // Save order to Firestore
            await orderService.create({
              userId: user.uid,
              items: cart.map(item => ({
                sneakerId: item.id,
                name: item.name,
                price: item.price,
                size: item.selectedSize,
                quantity: item.quantity
              })),
              totalAmount: total,
              status: 'paid',
              shippingAddress: shippingInfo,
              paystackReference: response.reference
            });

            // Send notification
            await notifyService.send({
              userId: user.uid,
              title: 'Order Confirmed',
              message: `Payment successful. Order #${response.reference.slice(-8).toUpperCase()} has been captured and sent to logistics.`,
              type: 'success'
            });

            clearCart();
            navigate('/dashboard/orders?success=true');
          } else {
            alert('Payment verification failed: ' + result.message);
          }
        } catch (err) {
          console.error('Network error during verification:', err);
          alert('An error occurred while verifying your payment.');
        } finally {
          setIsVerifying(false);
        }
      },
      onClose: () => {
        console.log('Payment Closed');
      }
    });
  };

  const handleCheckoutClick = () => {
    if (!user) {
      navigate('/auth?redirect=cart');
      return;
    }
    setShowAddressForm(true);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={48} className="text-stone-300" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Your bag is empty</h1>
        <p className="text-stone-500 mb-8 max-w-sm">When you add sneakers to your bag, they will appear here. Ready to shop?</p>
        <Link to="/products" className="bg-stone-900 text-white px-10 py-5 font-black uppercase text-sm tracking-widest hover:bg-black transition-colors">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-5xl font-black tracking-tighter italic uppercase mb-12">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item, idx) => (
            <motion.div 
              key={`${item.id}-${item.selectedSize}`}
              layout
              className="flex gap-6 pb-8 border-b border-white/5"
            >
              <div className="w-32 h-40 bg-white/5 flex-shrink-0">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-xl uppercase tracking-tight">{item.name}</h3>
                    <p className="font-black text-xl">${item.price}</p>
                  </div>
                  <p className="text-stone-500 text-sm small-caps mb-2">{item.brand}</p>
                  <p className="text-stone-400 text-sm font-bold uppercase tracking-widest text-[10px]">Size: {item.selectedSize}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-white/10">
                    <button className="p-2 hover:bg-white/5"><Minus size={16} /></button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button className="p-2 hover:bg-white/5"><Plus size={16} /></button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(idx)}
                    className="text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-stone-50 p-8 h-fit space-y-8 text-stone-900">
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-6 text-stone-900">Order Summary</h2>
          <div className="space-y-4 font-bold uppercase text-xs tracking-widest text-stone-900">
            <div className="flex justify-between text-stone-900">
              <span className="text-stone-500">Subtotal</span>
              <span className="text-stone-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-900">
              <span className="text-stone-500">Shipping</span>
              <span className="text-stone-900">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between py-6 border-y border-stone-200 text-lg text-stone-900">
              <span className="text-stone-900">Total</span>
              <span className="font-black text-stone-900">${total.toFixed(2)}</span>
            </div>
          </div>

          {showAddressForm ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-6 border-t border-stone-200">
              <h3 className="font-black uppercase tracking-tighter text-xl text-stone-900">Shipping Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full p-4 bg-white border border-stone-200 font-bold"
                  value={shippingInfo.fullName}
                  onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Street Address" 
                  className="w-full p-4 bg-white border border-stone-200 font-bold"
                  value={shippingInfo.street}
                  onChange={e => setShippingInfo({...shippingInfo, street: e.target.value})}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="w-full p-4 bg-white border border-stone-200 font-bold"
                    value={shippingInfo.city}
                    onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="State" 
                    className="w-full p-4 bg-white border border-stone-200 font-bold"
                    value={shippingInfo.state}
                    onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})}
                    required
                  />
                </div>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full p-4 bg-white border border-stone-200 font-bold"
                  value={shippingInfo.phone}
                  onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  required
                />
              </div>
              <button 
                onClick={handlePaystackCheckout}
                disabled={isVerifying || !shippingInfo.fullName || !shippingInfo.street || !shippingInfo.city || !shippingInfo.phone}
                className="w-full bg-stone-900 hover:bg-black text-white py-6 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center group disabled:opacity-50"
              >
                {isVerifying ? 'Verifying Payment...' : 'Secure Pay with Paystack'} 
                {!isVerifying && <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />}
              </button>
              <button 
                onClick={() => setShowAddressForm(false)}
                className="w-full text-stone-400 font-bold uppercase text-[10px] tracking-widest"
              >
                Back to summary
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={handleCheckoutClick}
              className="w-full bg-red-600 hover:bg-black text-white py-6 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center group"
            >
              Checkout <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <div className="flex items-center justify-center space-x-2 text-stone-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout Powered by Paystack</span>
          </div>

          <div className="pt-8">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.1em] mb-4">Accepted Payments</p>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-8 border border-stone-100 bg-white flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-8 border border-stone-100 bg-white flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-8 border border-stone-100 bg-white flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global interface for PaystackPop
declare global {
  interface Window {
    PaystackPop: any;
  }
}
