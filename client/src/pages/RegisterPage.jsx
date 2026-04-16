import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, User, Mail, Lock } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';
import Galaxy from '../components/Galaxy.jsx';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className="theme-animate min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-slate-950">
      <div className="absolute inset-0">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Galaxy
            mouseRepulsion
            mouseInteraction
            mouseEventTarget="window"
            density={1}
            glowIntensity={0.3}
            saturation={0}
            hueShift={140}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.5}
            speed={1}
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-100 dark:text-slate-100 tracking-tight">DailyFlow</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/30 p-8 border border-white/40 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Create your account</h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 mb-6">Start tracking tasks and building habits</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required className="input pl-9" placeholder="Arjun Singh"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required className="input pl-9" placeholder="you@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" required minLength={6} className="input pl-9" placeholder="Min. 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-300 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
