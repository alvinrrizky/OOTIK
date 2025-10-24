import React from 'react';
// Fix: Add .ts extension to import path.
// Fix: Changed TeamMember to LeaderboardUser to match expected prop type.
import type { User, Achievement, LeaderboardUser } from '../types.ts';
// Fix: Add .tsx extension to import path.
import ProgressBar from './ProgressBar.tsx';
// Fix: Add .tsx extension to import path.
import AchievementList from './AchievementList.tsx';
// Fix: Add .tsx extension to import path.
import Leaderboard from './Leaderboard.tsx';
// Fix: Add .tsx extension to import path.
import { LEVEL_THRESHOLDS } from '../constants.tsx';

interface GamificationDashboardProps {
  user: User;
  allAchievements: Achievement[];
  // Fix: Changed TeamMember[] to LeaderboardUser[] to match data from App.tsx.
  leaderboardData: LeaderboardUser[];
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ user, allAchievements, leaderboardData }) => {
  const currentLevelPoints = LEVEL_THRESHOLDS[user.level - 1];
  const nextLevelPoints = LEVEL_THRESHOLDS[user.level] ?? user.points;
  const pointsForLevel = user.points - currentLevelPoints;
  const pointsToNextLevel = nextLevelPoints - currentLevelPoints;

  return (
    <div className="space-y-8 p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 sticky top-8">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Progress</h3>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-violet-600 dark:text-violet-400">Level {user.level}</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">{user.points} / {nextLevelPoints} XP</span>
          </div>
          <ProgressBar value={pointsForLevel} max={pointsToNextLevel} />
        </div>
      </div>
      
      <AchievementList 
        unlockedIds={user.unlockedAchievementIds} 
        allAchievements={allAchievements} 
      />
      
      <Leaderboard users={leaderboardData} currentUser={user} />
    </div>
  );
};

export default GamificationDashboard;