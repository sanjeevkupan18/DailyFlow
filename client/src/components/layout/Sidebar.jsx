import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart2, User, Zap, LogOut, Sun, Moon, ScanEye } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useTodayStats } from '../../hooks/useStats';
import { useTheme } from '../../theme/ThemeProvider';

const NAV = [
  { to: '/today', icon: CheckSquare, label: 'Today' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/focus-sessions', icon: ScanEye, label: 'Focus' },
];

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const { data: today } = useTodayStats();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <aside className="hidden w-60 flex-shrink-0 border-r border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 md:flex md:h-screen md:flex-col md:sticky md:top-0">
        <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">DailyFlow</span>
          </div>
        </div>

        {today && today.totalTasks > 0 && (
          <div className="mx-4 mt-4 rounded-xl border border-primary-100 bg-primary-50 p-3 dark:border-primary-500/20 dark:bg-primary-500/10">
            <p className="mb-1 text-xs font-medium text-primary-600 dark:text-primary-300">Today's progress</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {today.completedTasks}/{today.totalTasks} tasks
              </span>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-200">{today.completionRate}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-500/20">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500"
                style={{ width: `${today.completionRate}%` }}
              />
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{user?.name}</p>
              <p className="truncate text-xs text-slate-400 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            className="theme-toggle"
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="relative grid h-9 w-9 place-items-center">
              <Sun
                size={16}
                className={`absolute transition-all duration-300 ${
                  isDark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <Moon
                size={16}
                className={`absolute transition-all duration-300 ${
                  isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </span>
            <span className="flex-1 text-left text-sm font-medium">
              {isDark ? 'Light mode' : 'Dark mode'}
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-primary-500/60' : 'bg-slate-200'
              }`}
              aria-hidden="true"
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-slate-950 ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>

          <button
            onClick={() => logout()}
            className="btn-ghost flex w-full items-center gap-2 text-sm"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-200'
                    : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <Icon size={17} />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
