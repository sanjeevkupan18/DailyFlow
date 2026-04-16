import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, LogOut, Sun, Moon } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/authStore';
import { authApi } from '../api/authApi';
import { categoryApi } from '../api/statsApi';
import { useLogout } from '../hooks/useAuth';
import { useTheme } from '../theme/ThemeProvider';

const PRESET_COLORS = ['#6366f1','#22c55e','#f59e0b','#ec4899','#14b8a6','#f97316','#8b5cf6','#ef4444'];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const qc = useQueryClient();
  const { mutate: logout } = useLogout();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState({ name: '', timezone: 'UTC', preferences: { dailyGoal: 5, theme: 'light' } });
  const [newCat, setNewCat] = useState({ name: '', color: '#6366f1', icon: '📁' });

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', timezone: user.timezone || 'UTC', preferences: { ...user.preferences } });
  }, [user]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const { mutate: saveProfile, isPending: saving } = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => { updateUser(data); toast.success('Profile updated!'); },
    onError: () => toast.error('Failed to update profile'),
  });

  const { mutate: createCat } = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setNewCat({ name: '', color: '#6366f1', icon: '📁' }); toast.success('Category created!'); },
  });

  const { mutate: deleteCat } = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  return (
    <div className="min-h-screen">
      <Navbar title="Profile & Settings" />

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* Profile section */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Personal Info</h3>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {profile.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">{profile.name}</p>
              <p className="text-sm text-slate-400 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Full name</label>
              <input className="input" value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">Timezone</label>
              <select className="input" value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}>
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 block">
              Daily task goal: <span className="text-primary-600 font-semibold">{profile.preferences?.dailyGoal} tasks</span>
            </label>
            <input type="range" min={1} max={30} className="w-full"
              value={profile.preferences?.dailyGoal || 5}
              onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, dailyGoal: Number(e.target.value) } })} />
            <div className="flex justify-between text-xs text-slate-300 dark:text-slate-600 mt-1"><span>1</span><span>30</span></div>
          </div>

          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => saveProfile(profile)}
            disabled={saving}
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
              type="button"
              className="btn-secondary flex items-center justify-center gap-2 sm:flex-1"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="btn-secondary flex items-center justify-center gap-2 text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 sm:flex-1"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>

        {/* Categories section */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Categories</h3>

          {/* Existing categories */}
          <div className="space-y-2 mb-5">
            {categories.map((cat) => (
              <div key={cat._id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 py-2 dark:border-slate-800 last:border-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: cat.color }} />
                  <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{cat.icon} {cat.name}</span>
                  {cat.isDefault && <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs">default</span>}
                </div>
                {!cat.isDefault && (
                  <button onClick={() => deleteCat(cat._id)} className="btn-ghost p-1 text-slate-300 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add new category */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">Add new category</p>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <input className="input flex-1" placeholder="Category name"
                value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
              <input type="text" className="input text-center text-lg sm:w-16" placeholder="📁"
                value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} />
            </div>

            {/* Color picker */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button key={c} onClick={() => setNewCat({ ...newCat, color: c })}
                  className={`w-6 h-6 rounded-full transition-all ${newCat.color === c ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''}`}
                  style={{ background: c }} />
              ))}
            </div>

            <button
              className="btn-secondary flex items-center gap-2 text-sm"
              onClick={() => newCat.name.trim() && createCat(newCat)}
            >
              <Plus size={14} />
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
