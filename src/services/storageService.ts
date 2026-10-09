import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { QuizResult, UserProfile, CharacterMastery } from '../types';

const LOCAL_STORAGE_HISTORY_KEY = 'kanaquest_quiz_history_v1';
const LOCAL_STORAGE_PROFILE_KEY = 'kanaquest_user_profile_v1';
const LOCAL_STORAGE_MASTERY_KEY = 'kanaquest_mastery_v1';

export function getLocalQuizHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalQuizHistory(history: QuizResult[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch (err) {
    console.warn('Failed to save history to local storage', err);
  }
}

export function getLocalProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalProfile(profile: UserProfile) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save profile to local storage', err);
  }
}

export function getLocalMastery(): CharacterMastery {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MASTERY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalMastery(mastery: CharacterMastery) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MASTERY_KEY, JSON.stringify(mastery));
  } catch (err) {
    console.warn('Failed to save mastery to local storage', err);
  }
}

/**
 * Saves a completed quiz result and updates user stats across local & cloud
 */
export async function saveQuizResult(
  userId: string | null,
  quizResult: QuizResult,
  userProfileInfo?: { email?: string; displayName?: string }
): Promise<{ profile: UserProfile; history: QuizResult[] }> {
  // 1. Update local storage first
  const currentHistory = getLocalQuizHistory();
  const updatedHistory = [quizResult, ...currentHistory.filter(h => h.id !== quizResult.id)];
  saveLocalQuizHistory(updatedHistory);

  // Update mastery
  const currentMastery = getLocalMastery();
  if (quizResult.items) {
    for (const item of quizResult.items) {
      const existing = currentMastery[item.kana] || { attempts: 0, correct: 0, accuracy: 0, lastPracticed: '' };
      const attempts = existing.attempts + 1;
      const correct = existing.correct + (item.isCorrect ? 1 : 0);
      currentMastery[item.kana] = {
        attempts,
        correct,
        accuracy: Math.round((correct / attempts) * 100),
        lastPracticed: quizResult.createdAt,
      };
    }
    saveLocalMastery(currentMastery);
  }

  // Calculate profile stats
  const nowIso = new Date().toISOString();
  const prevProfile = getLocalProfile();
  
  // Calculate streak
  const lastActiveDate = prevProfile?.lastActiveAt ? new Date(prevProfile.lastActiveAt).toDateString() : null;
  const todayDate = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toDateString();

  let streakDays = prevProfile?.streakDays || 1;
  if (lastActiveDate !== todayDate) {
    if (lastActiveDate === yesterdayDate) {
      streakDays += 1;
    } else if (lastActiveDate !== null) {
      streakDays = 1; // reset streak if gap > 1 day
    }
  }

  const newProfile: UserProfile = {
    userId: userId || 'guest',
    email: userProfileInfo?.email || prevProfile?.email || '',
    displayName: userProfileInfo?.displayName || prevProfile?.displayName || 'Hiragana Learner',
    totalQuizzes: (prevProfile?.totalQuizzes || 0) + 1,
    totalAnswers: (prevProfile?.totalAnswers || 0) + quizResult.totalQuestions,
    totalCorrect: (prevProfile?.totalCorrect || 0) + quizResult.score,
    streakDays,
    lastActiveAt: nowIso,
    createdAt: prevProfile?.createdAt || nowIso,
    updatedAt: nowIso,
  };
  saveLocalProfile(newProfile);

  // 2. If logged in to Firebase, sync to Firestore
  if (userId && userId !== 'guest') {
    const userDocPath = `users/${userId}`;
    const quizDocPath = `users/${userId}/quizResults/${quizResult.id}`;

    try {
      // Write quiz result doc
      const quizPayload = {
        id: quizResult.id,
        userId,
        exerciseType: quizResult.exerciseType,
        score: quizResult.score,
        totalQuestions: quizResult.totalQuestions,
        percentage: quizResult.percentage,
        timeSpentSeconds: quizResult.timeSpentSeconds,
        createdAt: quizResult.createdAt,
      };

      await setDoc(doc(db, quizDocPath), quizPayload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, quizDocPath);
    }

    try {
      // Write / update user profile doc
      const userProfilePayload = {
        userId,
        email: newProfile.email || '',
        displayName: newProfile.displayName || '',
        totalQuizzes: newProfile.totalQuizzes,
        totalAnswers: newProfile.totalAnswers,
        totalCorrect: newProfile.totalCorrect,
        streakDays: newProfile.streakDays,
        lastActiveAt: newProfile.lastActiveAt,
        createdAt: newProfile.createdAt,
        updatedAt: newProfile.updatedAt,
      };

      await setDoc(doc(db, userDocPath), userProfilePayload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, userDocPath);
    }
  }

  return { profile: newProfile, history: updatedHistory };
}

/**
 * Fetches user profile and history from Firestore and syncs locally
 */
export async function syncUserDataFromCloud(userId: string): Promise<{ profile: UserProfile | null; history: QuizResult[] }> {
  if (!userId || userId === 'guest') {
    return { profile: getLocalProfile(), history: getLocalQuizHistory() };
  }

  const userDocPath = `users/${userId}`;
  let remoteProfile: UserProfile | null = null;
  try {
    const profileSnap = await getDoc(doc(db, userDocPath));
    if (profileSnap.exists()) {
      remoteProfile = profileSnap.data() as UserProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userDocPath);
  }

  const quizColPath = `users/${userId}/quizResults`;
  let remoteHistory: QuizResult[] = [];
  try {
    const q = query(collection(db, quizColPath), orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    remoteHistory = querySnapshot.docs.map(docSnap => docSnap.data() as QuizResult);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, quizColPath);
  }

  // Merge with local history
  const localHistory = getLocalQuizHistory();
  const mergedMap = new Map<string, QuizResult>();
  for (const h of remoteHistory) mergedMap.set(h.id, h);
  for (const h of localHistory) {
    if (!mergedMap.has(h.id)) {
      mergedMap.set(h.id, h);
      // optionally push unsynced local results to cloud
      const singleQuizPath = `users/${userId}/quizResults/${h.id}`;
      setDoc(doc(db, singleQuizPath), {
        id: h.id,
        userId,
        exerciseType: h.exerciseType,
        score: h.score,
        totalQuestions: h.totalQuestions,
        percentage: h.percentage,
        timeSpentSeconds: h.timeSpentSeconds,
        createdAt: h.createdAt,
      }).catch(err => {
        console.warn('Sync background save error', err);
      });
    }
  }

  const finalHistory = Array.from(mergedMap.values()).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  saveLocalQuizHistory(finalHistory);

  if (remoteProfile) {
    saveLocalProfile(remoteProfile);
  }

  return { profile: remoteProfile || getLocalProfile(), history: finalHistory };
}
