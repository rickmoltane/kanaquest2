/**
 * Client-side Cookie & Storage tracker for KanaQuest Guest Accounts.
 * Allows persistent recognition across browser sessions without requiring
 * registration, login, or manual sync credentials.
 */

export interface GuestUserData {
  guestId: string;
  displayName: string;
  createdAt: string;
  lastVisit: string;
  visitCount: number;
  isReturning: boolean;
}

const COOKIE_NAME = 'kq_guest_session';
const LOCAL_MIRROR_KEY = 'kanaquest_guest_cookie_mirror';
const COOKIE_EXPIRY_DAYS = 365; // 1 year persistence

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const raw = parts.pop()?.split(';').shift();
    if (raw) {
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
}

export function setCookie(name: string, value: string, days = COOKIE_EXPIRY_DAYS): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
}

/**
 * Initializes or restores the guest account from the cookie (with localStorage fallback).
 * Automatically marks whether the user is returning from a previous session.
 */
export function initGuestUser(): GuestUserData {
  const now = new Date().toISOString();
  let existingRaw = getCookie(COOKIE_NAME);

  // Check localStorage mirror if cookie is missing (e.g. strict third-party cookie sandboxes)
  if (!existingRaw) {
    try {
      existingRaw = localStorage.getItem(LOCAL_MIRROR_KEY);
    } catch {
      existingRaw = null;
    }
  }

  if (existingRaw) {
    try {
      const parsed = JSON.parse(existingRaw) as Partial<GuestUserData>;
      if (parsed.guestId) {
        const updated: GuestUserData = {
          guestId: parsed.guestId,
          displayName: parsed.displayName || `Guest #${parsed.guestId.replace('guest_', '')}`,
          createdAt: parsed.createdAt || now,
          lastVisit: now,
          visitCount: (parsed.visitCount || 1) + 1,
          isReturning: true,
        };

        // Resave cookie & local mirror with refreshed expiration
        saveGuestUser(updated);
        return updated;
      }
    } catch (e) {
      console.warn('Failed to parse existing guest session cookie', e);
    }
  }

  // Generate a brand new guest user
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newGuest: GuestUserData = {
    guestId: `guest_${randomSuffix}`,
    displayName: `Guest #${randomSuffix}`,
    createdAt: now,
    lastVisit: now,
    visitCount: 1,
    isReturning: false,
  };

  saveGuestUser(newGuest);
  return newGuest;
}

/**
 * Saves guest user data to both document.cookie and localStorage mirror
 */
export function saveGuestUser(data: GuestUserData): void {
  const payload = JSON.stringify(data);
  setCookie(COOKIE_NAME, payload, COOKIE_EXPIRY_DAYS);
  try {
    localStorage.setItem(LOCAL_MIRROR_KEY, payload);
  } catch (err) {
    console.warn('Could not mirror guest cookie to localStorage', err);
  }
}

/**
 * Updates guest display name and persists to cookie
 */
export function updateGuestDisplayName(newName: string): GuestUserData {
  const current = initGuestUser();
  const trimmed = newName.trim();
  const updated: GuestUserData = {
    ...current,
    displayName: trimmed || current.displayName,
  };
  saveGuestUser(updated);
  return updated;
}

/**
 * Clears and resets the guest account
 */
export function resetGuestUser(): GuestUserData {
  deleteCookie(COOKIE_NAME);
  try {
    localStorage.removeItem(LOCAL_MIRROR_KEY);
  } catch {}
  return initGuestUser();
}
