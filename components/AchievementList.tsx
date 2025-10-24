import React from 'react';
// Fix: Add .ts extension to import path.
import type { Achievement } from '../types.ts';

interface AchievementListProps {
  unlockedIds: number[];
  allAchievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ unlockedIds, allAchievements }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Achievements</h3>
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
        {allAchievements.map(achievement => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`
                group relative flex flex-col items-center justify-center p-3 
                bg-slate-100 dark:bg-slate-700/50 rounded-lg aspect-square transition-all duration-300
                ${isUnlocked ? 'border-2 border-amber-400/50' : 'border border-slate-200 dark:border-slate-600'}
              `}
            >
              <div className={`text-3xl ${isUnlocked ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {achievement.icon}
              </div>
              <div
                className="
                  absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-800 dark:bg-slate-900 border border-slate-700
                  text-sm text-slate-100 dark:text-slate-200 rounded-md opacity-0 group-hover:opacity-100 
                  transition-opacity pointer-events-none z-10
                "
              >
                <p className="font-bold">{achievement.title}</p>
                <p className="text-xs text-slate-300 dark:text-slate-400">{achievement.description}</p>
                {!isUnlocked && <p className="text-xs text-red-400 italic mt-1">Locked</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementList;