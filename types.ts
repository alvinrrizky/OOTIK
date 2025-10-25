export type ActivityCategory = 'Project' | 'Personal' | 'Urgent' | 'Team';
export type ActivityStatus = 'To Do' | 'In Progress' | 'Pending' | 'Completed' | 'Re-Open';
export type ViewType = 'dashboard' | 'history' | 'team';

export interface User {
  id: number;
  name: string;
  avatar: string;
  position: string;
  email: string;
  role: 'Ketua Tim' | 'Anggota';
}

export interface Evidence {
  type: 'file' | 'text';
  content: string;
  fileName?: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category: ActivityCategory;
  status: ActivityStatus;
  assignee: User;
  evidence?: Evidence;
  reopened?: boolean;
  reopenEvidence?: Evidence;
}
