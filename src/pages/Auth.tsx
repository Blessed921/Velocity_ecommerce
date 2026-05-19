import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { userService, handleFirestoreError, OperationType } from '../services/dbService';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const attemptAuth = async (retries = 2): Promise<any> => {
        try {
          if (isLogin) {
            return await signInWithEmailAndPassword(auth, email, password);
          } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            return userCredential;
          }
        } catch (err: any) {
          if (err.code === 'auth/network-request-failed' && retries > 0) {
            console.log(`Retrying auth... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            return attemptAuth(retries - 1);
          }
          throw err;
        }
      };

      const userCredential = await attemptAuth();
      
      if (userCredential) {
        // Ensure user profile exists in Firestore
        const user = userCredential.user;
        const userPath = `users/${user.uid}`;
        const userRef = doc(db, 'users', user.uid);
        
        try {
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await userService.initProfile(user.uid, {
              email: user.email || email,
              displayName: user.displayName || name || 'User',
              role: UserRole.USER,
              wishlist: []
            });
          } else if (!isLogin) {
            // If they are registering but doc somehow exists, update it
            await userService.initProfile(user.uid, {
              displayName: name || user.displayName || undefined
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
      }
      navigate(redirect);
    } catch (err: any) {
      console.error('Registration/Login Detailed Error:', {
        code: err.code,
        message: err.message,
        name: err.name,
        stack: err.stack,
        fullError: err
      });

      if (err.code === 'auth/network-request-failed') {
        setError('Network connectivity issue. Please ensure your browser is not blocking Google services (Identity Toolkit) or try refreshing the page.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is not enabled in your Firebase Console. Please go to the Firebase Console -> Authentication -> Sign-in Method and enable "Email/Password".');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in instead.');
      } else {
        try {
          const parsed = JSON.parse(err.message);
          setError(parsed.error || err.message);
        } catch {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Authentication system not initialized.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      // Ensure the popup is triggered correctly
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Initialize/Update user profile in Firestore
      const userPath = `users/${user.uid}`;
      
      try {
        await userService.initProfile(user.uid, {
          email: user.email || '',
          displayName: user.displayName || 'Anonymous User',
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }
      
      navigate(redirect);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled in your Firebase Console.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#111] border border-white/5 p-12 relative z-10"
      >
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif italic tracking-tighter font-bold">
              {isLogin ? 'Welcome Back' : 'Join Velocity'}
            </h1>
            <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest leading-none">
              {isLogin ? 'Enter your credentials' : 'Initialize your profile'}
            </p>
          </div>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors border-b border-white/10 pb-1"
          >
            {isLogin ? 'Register' : 'Access'}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/10 border border-red-900/30 text-red-500 text-[9px] uppercase font-black tracking-widest leading-none">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {!isLogin && (
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-600 block ml-1">Identity Name</label>
              <div className="relative">
                <User size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/5 px-14 py-4 text-sm outline-none focus:border-white/20 transition-all text-white placeholder-stone-800"
                  placeholder="Ex. Alexander"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-600 block ml-1">Authentication Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/5 px-14 py-4 text-sm outline-none focus:border-white/20 transition-all text-white placeholder-stone-800"
                placeholder="identity@velocity.xyz"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-600 block ml-1">Security Key</label>
            <div className="relative">
              <Lock size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-700" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/5 px-14 py-4 text-sm outline-none focus:border-white/20 transition-all text-white placeholder-stone-800"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-white text-black font-black uppercase tracking-[0.45em] text-[10px] hover:bg-stone-200 transition-all flex items-center justify-center disabled:opacity-50 shadow-2xl"
          >
            {loading ? 'Authenticating...' : isLogin ? 'Access System' : 'Create Profiling'}
            {!loading && <ArrowRight size={14} className="ml-4 opacity-30" />}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.2em]">
              <span className="bg-[#111] px-4 text-stone-600">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-14 bg-[#0a0a0a] border border-white/5 text-stone-400 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-700">
            Secure Connection Established • V-Sync v1.0.4 • {navigator.onLine ? "ONLINE" : "OFFLINE"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
