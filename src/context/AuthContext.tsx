import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { syncUserDataFromCloud, getLocalProfile, getLocalQuizHistory } from '../services/storageService';
import { UserProfile, QuizResult } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  profile: UserProfile | null;
  history: QuizResult[];
  isSyncing: boolean;
  syncError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(getLocalProfile());
  const [history, setHistory] = useState<QuizResult[]>(getLocalQuizHistory());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refreshUserData = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      if (currentUser) {
        const synced = await syncUserDataFromCloud(currentUser.uid);
        if (synced.profile) setProfile(synced.profile);
        setHistory(synced.history);
      } else {
        setProfile(getLocalProfile());
        setHistory(getLocalQuizHistory());
      }
    } catch (err) {
      console.error('Failed to sync user data', err);
      setSyncError('Could not sync with cloud. Offline mode active.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        await refreshUserData();
      } else {
        setProfile(getLocalProfile());
        setHistory(getLocalQuizHistory());
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setSyncError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      console.error('Google Sign-In Error:', msg);
      setSyncError('Google Sign-In was cancelled or not allowed.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(getLocalProfile());
      setHistory(getLocalQuizHistory());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        profile,
        history,
        isSyncing,
        syncError,
        loginWithGoogle,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
