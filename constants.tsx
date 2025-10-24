import React from 'react';
import type { ActivityCategory } from './types.ts';

export const ICONS = {
  PLUS: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  CROWN: '👑',
  POINTS: '✨',
  LEVEL_UP: '🚀',
  ACHIEVEMENT: '🏆',
  PROJECT: '💼',
  PERSONAL: '👤',
  URGENT: '🔥',
  TEAM: '👥',
  COMPLETE: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  CLOCK: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000
];

export const CATEGORIES: { name: ActivityCategory; icon: string }[] = [
    { name: 'Project', icon: ICONS.PROJECT },
    { name: 'Personal', icon: ICONS.PERSONAL },
    { name: 'Urgent', icon: ICONS.URGENT },
    { name: 'Team', icon: ICONS.TEAM },
];
