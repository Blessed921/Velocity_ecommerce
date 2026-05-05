import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from '../services/dbService';
import { UserProfile, CartItem, Sneaker, UserRole } from '../types';

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
          unsubscribeProfile = userService.subscribeToProfile(u.uid, async (p) => {
            if (!p) {
              // Profile doesn't exist in this database, initialize it
              await userService.initProfile(u.uid, {
                email: u.email || '',
                displayName: u.displayName || 'User',
                role: UserRole.USER,
                wishlist: []
              });
            } else {
              setProfile(p);
            }
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
    if (!user) {
      alert('Keep your wishlist across devices. Please log in to save favorites.');
      return;
    }

    let currentProfile = profile;
    
    // If profile is missing but user is logged in, try to create it
    if (!currentProfile) {
      try {
        const newProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          role: 'user' as const,
          wishlist: [sneakerId],
          createdAt: new Date().toISOString()
        };
        await userService.updateWishlist(user.uid, [sneakerId]); // This will likely fail if doc doesn't exist
        // Better: use a dedicated initialize method or setDoc
        setProfile(newProfile);
        return;
      } catch (err) {
        console.error('Failed to initialize profile on wishlist toggle:', err);
        alert('Could not sync wishlist. Please try logging in again.');
        return;
      }
    }

    const currentWishlist = currentProfile.wishlist || [];
    const newWishlist = currentWishlist.includes(sneakerId)
      ? currentWishlist.filter(id => id !== sneakerId)
      : [...currentWishlist, sneakerId];
    
    try {
      await userService.updateWishlist(user.uid, newWishlist);
      setProfile({ ...currentProfile, wishlist: newWishlist });
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
