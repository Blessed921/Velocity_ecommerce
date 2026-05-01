import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, orderBy, limit, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole, UserProfile, Sneaker, Review, Order } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const sneakerService = {
  async getAll() {
    const path = 'sneakers';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sneaker));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  },

  async getById(id: string) {
    const path = `sneakers/${id}`;
    try {
      const docRef = doc(db, 'sneakers', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Sneaker;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
    }
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    const path = 'reviews';
    try {
      return await addDoc(collection(db, path), {
        ...review,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  getReviews(sneakerId: string, callback: (reviews: Review[]) => void) {
    const path = 'reviews';
    const q = query(collection(db, path), where('sneakerId', '==', sneakerId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, path);
    });
  }
};

export const userService = {
  async getProfile(uid: string) {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
    }
  },

  async updateWishlist(uid: string, wishlist: string[]) {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { 
        wishlist,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, path);
    }
  },

  subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    const path = `users/${uid}`;
    const docRef = doc(db, 'users', uid);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ uid: snapshot.id, ...snapshot.data() } as UserProfile);
      } else {
        callback(null);
      }
    }, (e) => {
      handleFirestoreError(e, OperationType.GET, path);
    });
  }
};

export const orderService = {
  async create(order: Omit<Order, 'id' | 'createdAt'>) {
    const path = 'orders';
    try {
      return await addDoc(collection(db, path), {
        ...order,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async getByUser(userId: string) {
    const path = 'orders';
    try {
      const q = query(collection(db, path), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  }
};
