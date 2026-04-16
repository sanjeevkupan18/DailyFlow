import { format } from 'date-fns';

export default function Navbar({ title, subtitle }) {
  return (
    <header className="theme-animate sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {title && <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 sm:text-xl">{title}</h1>}
          {subtitle && <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-400">{subtitle}</p>}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-400 sm:text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>
    </header>
  );
}
