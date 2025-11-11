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

const clearLocal = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_UNTIL_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
};

const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_USER_KEY);
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
    const expiresAt = Date.now() + REMEMBER_ME_DURATION_MS;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, serializedUser);
    localStorage.setItem(LEGACY_USER_KEY, serializedUser);
    localStorage.setItem(REMEMBER_UNTIL_KEY, String(expiresAt));
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    sessionStorage.setItem(LEGACY_TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, serializedUser);
    sessionStorage.setItem(LEGACY_USER_KEY, serializedUser);
  }
};

export const loadAuthData = () => {
  if (typeof window === 'undefined') return null;

  const now = Date.now();
  const rememberUntilRaw = localStorage.getItem(REMEMBER_UNTIL_KEY);

  if (rememberUntilRaw) {
    const rememberUntil = Number(rememberUntilRaw);
    const rememberedToken =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY);
    const rememberedUser = safeParse(localStorage.getItem(USER_KEY));

    if (!Number.isFinite(rememberUntil) || now > rememberUntil || !rememberedToken || !rememberedUser) {
      clearLocal();
    } else {
      return { token: rememberedToken, user: rememberedUser, remember: true };
    }
  } else {
    // Legacy persisted credentials without explicit remember flag
    const legacyToken =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY);
    const legacyUser = safeParse(
      localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY)
    );
    if (legacyToken && legacyUser) {
      return { token: legacyToken, user: legacyUser, remember: true };
    }
  }

  const sessionToken =
    sessionStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(LEGACY_TOKEN_KEY);
  const sessionUser = safeParse(
    sessionStorage.getItem(USER_KEY) || sessionStorage.getItem(LEGACY_USER_KEY)
  );

  if (sessionToken && sessionUser) {
    return { token: sessionToken, user: sessionUser, remember: false };
  }

  return null;
};

export const getStoredToken = () => {
  const auth = loadAuthData();
  return auth?.token || null;
};


