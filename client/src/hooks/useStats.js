import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/statsApi';

export function useTodayStats() {
  return useQuery({ queryKey: ['stats', 'today'], queryFn: statsApi.getToday });
}

export function useWeeklyStats() {
  return useQuery({ queryKey: ['stats', 'weekly'], queryFn: statsApi.getWeekly });
}

export function useMonthlyStats(month) {
  return useQuery({ queryKey: ['stats', 'monthly', month], queryFn: () => statsApi.getMonthly(month) });
}

export function useHeatmap(year) {
  return useQuery({ queryKey: ['stats', 'heatmap', year], queryFn: () => statsApi.getHeatmap(year) });
}

export function useStreak() {
  return useQuery({ queryKey: ['stats', 'streak'], queryFn: statsApi.getStreak });
}

export function useTrends(period = 30) {
  return useQuery({ queryKey: ['stats', 'trends', period], queryFn: () => statsApi.getTrends(period) });
}

export function useCategoryStats(period = 30) {
  return useQuery({ queryKey: ['stats', 'categories', period], queryFn: () => statsApi.getCategories(period) });
}

export function useObservations() {
  return useQuery({ queryKey: ['stats', 'observations'], queryFn: statsApi.getObservations, staleTime: 5 * 60 * 1000 });
}
