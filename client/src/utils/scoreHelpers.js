export const scoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-500';
};

export const scoreBg = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-700';
  if (score >= 50) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-600';
};

export const scoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Great';
  if (score >= 50) return 'Good';
  if (score >= 25) return 'Fair';
  return 'Needs work';
};

export const heatmapLevel = (value) => {
  if (value === 0) return 0;
  if (value < 25) return 1;
  if (value < 50) return 2;
  if (value < 75) return 3;
  return 4;
};

export const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
