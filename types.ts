import type { ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  level: number;
  points: number;
  unlockedAchievementIds: number[];
}

export type ActivityStatus = 'To Do' | 'Pending' | 'Completed';
export type ActivityCategory = 'Project' | 'Personal' | 'Urgent' | 'Team';

export interface Evidence {
  type: 'text' | 'file';
  content: string;
  fileName?: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time?: string;
  status: ActivityStatus;
  category: ActivityCategory;
  points: number;
  assignee: {
    name: string;
    avatar: string;
  };
  evidence?: Evidence;
}

export interface Achievement {
  id: number;
  title:string;
  description: string;
  icon: string;
  points: number;
}

export interface TeamMember extends User {
  activities: Activity[];
}

export type LeaderboardUser = Pick<User, 'id' | 'name' | 'avatar' | 'level' | 'points'>;

export interface Notification {
  id: number;
  message: string;
  type: 'points' | 'levelUp' | 'achievement';
  // Fix: Replace JSX.Element with ReactNode to resolve namespace error.
  icon: ReactNode;
}