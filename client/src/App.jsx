import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TodayPage from './pages/TodayPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import useAuthStore from './store/authStore';
import Pomodoro from './components/Pomodoro';

function AppLayout({ children }) {
  return (
    <div className="theme-animate flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:h-screen md:flex-row md:overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/today" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/today" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
            path="/dashboard"
          />
          <Route
            element={
              <AppLayout>
                <TodayPage />
              </AppLayout>
            }
            path="/today"
          />
          <Route
            element={
              <AppLayout>
                <AnalyticsPage />
              </AppLayout>
            }
            path="/analytics"
          />
          <Route
            element={
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            }
            path="/profile"
          />
          <Route
            element={
              <AppLayout>
                <div className="min-h-full flex items-center justify-center px-4 py-6 sm:px-6">
                  <Pomodoro />
                </div>
              </AppLayout>
            }
            path="/focus-sessions"
          />
          <Route path="/" element={<Navigate to="/today" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
