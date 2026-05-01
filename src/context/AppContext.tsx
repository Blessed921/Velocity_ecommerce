import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from '../services/dbService';
import { UserProfile, CartItem, Sneaker } from '../types';

interface AppContextType {
  user: User | null;
  profile: UserProfile | null;
  cart: CartItem[];
  addToCart: (sneaker: Sneaker, size: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (sneakerId: string) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }

      if (u) {
        try {
          unsubscribeProfile = userService.subscribeToProfile(u.uid, (p) => {
            setProfile(p);
            setLoading(false);
          });
        } catch (err) {
          console.error('Failed to subscribe to profile:', err);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const addToCart = (sneaker: Sneaker, size: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === sneaker.id && item.selectedSize === size);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...sneaker, selectedSize: size, quantity: 1 }];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (sneakerId: string) => {
    if (!profile) {
      alert('Please initialize your profile to save favorites.');
      return;
    }
    const currentWishlist = profile.wishlist || [];
    const newWishlist = currentWishlist.includes(sneakerId)
      ? currentWishlist.filter(id => id !== sneakerId)
      : [...currentWishlist, sneakerId];
    
    try {
      await userService.updateWishlist(profile.uid, newWishlist);
      setProfile({ ...profile, wishlist: newWishlist });
    } catch (err) {
      console.error('Wishlist sync failed:', err);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      profile, 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      wishlist: profile?.wishlist || [], 
      toggleWishlist,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
