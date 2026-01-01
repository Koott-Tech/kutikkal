const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';
const LEGACY_TOKEN_KEY = 'token';
const LEGACY_USER_KEY = 'user';
const ACCESS_TOKEN_KEY = 'accessToken';
const REMEMBER_UNTIL_KEY = 'authRememberUntil';

export const REMEMBER_ME_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse stored auth data:', error);
    return null;
  }
};

const getLocalStorage = () => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
};

const getSessionStorage = () => {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return null;
  }
  return window.sessionStorage;
};

const clearLocal = () => {
  const storage = getLocalStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
  storage.removeItem(REMEMBER_UNTIL_KEY);
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(LEGACY_TOKEN_KEY);
  storage.removeItem(LEGACY_USER_KEY);
};

const clearSession = () => {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(LEGACY_TOKEN_KEY);
  storage.removeItem(LEGACY_USER_KEY);
};

export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  clearLocal();
  clearSession();
};

export const storeAuthData = ({ token, user, remember }) => {
  if (typeof window === 'undefined') return;
  clearAuthData();

  const serializedUser = JSON.stringify(user ?? {});

  if (remember) {
    const local = getLocalStorage();
    if (!local) {
      console.warn('localStorage not available - cannot store "Remember Me" data');
      return;
    }
    const expiresAt = Date.now() + REMEMBER_ME_DURATION_MS;
    local.setItem(TOKEN_KEY, token);
    local.setItem(ACCESS_TOKEN_KEY, token);
    local.setItem(LEGACY_TOKEN_KEY, token);
    local.setItem(USER_KEY, serializedUser);
    local.setItem(LEGACY_USER_KEY, serializedUser);
    local.setItem(REMEMBER_UNTIL_KEY, String(expiresAt));
    console.log('✅ Auth data stored in localStorage with "Remember Me" (expires:', new Date(expiresAt).toLocaleString(), ')');
  } else {
    const session = getSessionStorage();
    if (!session) {
      console.warn('sessionStorage not available - cannot store session data');
      return;
    }
    session.setItem(TOKEN_KEY, token);
    session.setItem(ACCESS_TOKEN_KEY, token);
    session.setItem(LEGACY_TOKEN_KEY, token);
    session.setItem(USER_KEY, serializedUser);
    session.setItem(LEGACY_USER_KEY, serializedUser);
    console.log('✅ Auth data stored in sessionStorage (expires when tab closes)');
  }
};

export const loadAuthData = () => {
  if (typeof window === 'undefined') return null;

  const local = getLocalStorage();
  const session = getSessionStorage();

  const now = Date.now();
  const rememberUntilRaw = local?.getItem(REMEMBER_UNTIL_KEY);

  if (rememberUntilRaw) {
    const rememberUntil = Number(rememberUntilRaw);
    const rememberedToken =
      local?.getItem(TOKEN_KEY) ||
      local?.getItem(ACCESS_TOKEN_KEY) ||
      local?.getItem(LEGACY_TOKEN_KEY);
    const rememberedUser = safeParse(local?.getItem(USER_KEY));

    if (!Number.isFinite(rememberUntil) || now > rememberUntil || !rememberedToken || !rememberedUser) {
      console.log('⚠️ "Remember Me" data expired or invalid - clearing');
      clearLocal();
    } else {
      const daysRemaining = Math.ceil((rememberUntil - now) / (1000 * 60 * 60 * 24));
      console.log('✅ Loaded auth data from localStorage (Remember Me active,', daysRemaining, 'days remaining)');
      return { token: rememberedToken, user: rememberedUser, remember: true };
    }
  } else if (local) {
    // Legacy persisted credentials without explicit remember flag
    const legacyToken =
      local.getItem(TOKEN_KEY) ||
      local.getItem(ACCESS_TOKEN_KEY) ||
      local.getItem(LEGACY_TOKEN_KEY);
    const legacyUser = safeParse(
      local.getItem(USER_KEY) || local.getItem(LEGACY_USER_KEY)
    );
    if (legacyToken && legacyUser) {
      console.log('✅ Loaded auth data from localStorage (legacy format)');
      return { token: legacyToken, user: legacyUser, remember: true };
    }
  }

  const sessionToken =
    session?.getItem(TOKEN_KEY) ||
    session?.getItem(ACCESS_TOKEN_KEY) ||
    session?.getItem(LEGACY_TOKEN_KEY);
  const sessionUser = safeParse(
    session?.getItem(USER_KEY) || session?.getItem(LEGACY_USER_KEY)
  );

  if (sessionToken && sessionUser) {
    console.log('✅ Loaded auth data from sessionStorage (session only)');
    return { token: sessionToken, user: sessionUser, remember: false };
  }

  console.log('ℹ️ No stored auth data found');
  return null;
};

export const getStoredToken = () => {
  const auth = loadAuthData();
  return auth?.token || null;
};


