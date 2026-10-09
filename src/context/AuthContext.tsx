import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInAnonymously,
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  syncUserDataFromCloud, 
  getLocalProfile, 
  getLocalQuizHistory, 
  saveLocalProfile 
} from '../services/storageService';
import { 
  initGuestUser, 
  saveGuestUser, 
  updateGuestDisplayName, 
  GuestUserData 
} from '../utils/cookieTracker';
import { UserProfile, QuizResult } from '../types';

interface AuthContextType {
  currentUser: User | null;
  guestUser: GuestUserData;
  loading: boolean;
  profile: UserProfile | null;
  history: QuizResult[];
  isReturningGuest: boolean;
  showWelcomeBack: boolean;
  dismissWelcomeBack: () => void;
  updateDisplayName: (newName: string) => void;
  refreshUserData: () => Promise<void>;
  isSyncing: boolean;
  syncError: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize guest session from cookie
  const [guestUser, setGuestUser] = useState<GuestUserData>(() => initGuestUser());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWelcomeBack, setShowWelcomeBack] = useState<boolean>(false);
  
  // 2. Initialize profile and history from local storage
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const existing = getLocalProfile();
    if (existing) {
      return existing;
    }
    const initialGuest = initGuestUser();
    const newProfile: UserProfile = {
      userId: initialGuest.guestId,
      displayName: initialGuest.displayName,
      totalQuizzes: 0,
      totalAnswers: 0,
      totalCorrect: 0,
      streakDays: 1,
      lastActiveAt: new Date().toISOString(),
      createdAt: initialGuest.createdAt,
      updatedAt: new Date().toISOString(),
    };
    saveLocalProfile(newProfile);
    return newProfile;
  });

  const [history, setHistory] = useState<QuizResult[]>(() => getLocalQuizHistory());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // If returning guest on initial mount, trigger the subtle welcome notice
  useEffect(() => {
    if (guestUser.isReturning) {
      setShowWelcomeBack(true);
      const timer = setTimeout(() => {
        setShowWelcomeBack(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [guestUser.isReturning]);

  const dismissWelcomeBack = useCallback(() => {
    setShowWelcomeBack(false);
  }, []);

  // Update display name across cookie, state, and profile
  const updateDisplayName = useCallback((newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = updateGuestDisplayName(trimmed);
    setGuestUser(updated);

    setProfile(prev => {
      const updatedProf: UserProfile = {
        ...(prev || {
          userId: updated.guestId,
          totalQuizzes: 0,
          totalAnswers: 0,
          totalCorrect: 0,
          streakDays: 1,
          lastActiveAt: new Date().toISOString(),
          createdAt: updated.createdAt,
          updatedAt: new Date().toISOString(),
        }),
        displayName: trimmed,
        updatedAt: new Date().toISOString(),
      };
      saveLocalProfile(updatedProf);
      return updatedProf;
    });
  }, []);

  const refreshUserData = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      if (currentUser) {
        const synced = await syncUserDataFromCloud(currentUser.uid);
        if (synced.profile) {
          // Keep display name aligned with cookie
          const mergedProf = {
            ...synced.profile,
            displayName: guestUser.displayName || synced.profile.displayName,
          };
          setProfile(mergedProf);
          saveLocalProfile(mergedProf);
        }
        setHistory(synced.history);
      } else {
        setProfile(getLocalProfile());
        setHistory(getLocalQuizHistory());
      }
    } catch (err) {
      console.warn('Background sync check', err);
      // Graceful offline fallback - no interruption
      setProfile(getLocalProfile());
      setHistory(getLocalQuizHistory());
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, guestUser.displayName]);

  // Background silent authentication (anonymous - never prompts or asks user)
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        try {
          const synced = await syncUserDataFromCloud(user.uid);
          if (isMounted) {
            if (synced.profile) setProfile(synced.profile);
            setHistory(synced.history);
          }
        } catch {
          // Silent fallback to local storage
        }
      } else {
        // Sign in anonymously in the background so Firestore rules succeed transparently
        try {
          await signInAnonymously(auth);
        } catch {
          if (isMounted) setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Backwards compatibility stubs (no user-facing popups or registration)
  const loginWithGoogle = async () => {
    // No-op or silent fallback since user requested guest cookie tracking instead of login/sync
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(getLocalProfile());
      setHistory(getLocalQuizHistory());
    } catch (err) {
      console.warn('Sign out warning', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        guestUser,
        loading,
        profile,
        history,
        isReturningGuest: guestUser.isReturning,
        showWelcomeBack,
        dismissWelcomeBack,
        updateDisplayName,
        refreshUserData,
        isSyncing,
        syncError,
        loginWithGoogle,
        logout,
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

