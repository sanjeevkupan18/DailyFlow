import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useAuthStore from '../store/authStore';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'dailyflow-theme';

function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
}

function getSystemTheme() {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  } catch {
    return false;
  }
}

function applyThemeToDocument(theme, opts = {}) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;

  const origin = opts?.origin;
  if (origin && typeof origin.x === 'number' && typeof origin.y === 'number') {
    root.style.setProperty('--theme-flip-x', `${Math.round(origin.x)}px`);
    root.style.setProperty('--theme-flip-y', `${Math.round(origin.y)}px`);
  }

  if (!opts?.animate || prefersReducedMotion()) return;

  // Re-trigger the animation each toggle.
  root.classList.remove('theme-flip');
  // eslint-disable-next-line no-unused-expressions
  root.offsetWidth;
  root.classList.add('theme-flip');
}

export function ThemeProvider({ children }) {
  const user = useAuthStore((s) => s.user);
  const userPrefs = useAuthStore((s) => s.user?.preferences);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [theme, setThemeState] = useState(() => {
    const stored = getStoredTheme();
    if (stored) return stored;
    const userTheme = user?.preferences?.theme;
    if (userTheme === 'dark' || userTheme === 'light') return userTheme;
    return getSystemTheme();
  });

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const animTimeoutRef = useRef(null);

  const setTheme = useCallback(
    (nextTheme, origin, opts = {}) => {
      if (nextTheme !== 'dark' && nextTheme !== 'light') return;
      setThemeState(nextTheme);
      themeRef.current = nextTheme;

      const persist = opts.persist !== false;
      const animate = opts.animate !== false;
      const syncUser = opts.syncUser !== false;

      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch {
          // ignore
        }
      }

      if (animate && !prefersReducedMotion()) {
        if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
        applyThemeToDocument(nextTheme, { origin, animate: true });
        animTimeoutRef.current = window.setTimeout(() => {
          document.documentElement.classList.remove('theme-flip');
        }, 520);
      } else {
        applyThemeToDocument(nextTheme, { origin, animate: false });
      }

      // Keep client-side user state in sync so screens that read it update immediately.
      if (syncUser && userPrefs && userPrefs.theme !== nextTheme) {
        updateUser({ preferences: { ...userPrefs, theme: nextTheme } });
      }
    },
    [updateUser, userPrefs]
  );

  const toggleTheme = useCallback(
    (origin) => setTheme(themeRef.current === 'dark' ? 'light' : 'dark', origin),
    [setTheme]
  );

  // Apply the current theme class before paint to avoid a flash on refresh.
  useLayoutEffect(() => {
    applyThemeToDocument(theme, { animate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user preference arrives later (login), adopt it unless the user already chose locally.
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) return;
    const userTheme = user?.preferences?.theme;
    if (userTheme === 'dark' || userTheme === 'light') setTheme(userTheme, undefined, { animate: false, syncUser: false });
  }, [user?.preferences?.theme, setTheme]);

  useEffect(() => () => {
    if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
