import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import useAuthStore from '../store/authStore';

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate('/today');
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate('/today');
      toast.success(`Welcome to DailyFlow, ${data.user.name}!`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
}
