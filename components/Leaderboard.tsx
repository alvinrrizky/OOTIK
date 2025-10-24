import React from 'react';
// Fix: Add .ts extension to import path.
import type { LeaderboardUser, User } from '../types.ts';
// Fix: Add .tsx extension to import path.
import { ICONS } from '../constants.tsx';

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUser }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Leaderboard</h3>
      <ul className="mt-4 space-y-3">
        {users.map((user, index) => (
          <li
            key={user.id}
            className={`
              flex items-center space-x-4 p-3 rounded-lg
              ${user.name === currentUser.name 
                ? 'bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 dark:border-violet-500/30' 
                : 'bg-slate-100 dark:bg-slate-700/50'}
            `}
          >
            <span className="font-bold text-lg w-6 text-center text-slate-500 dark:text-slate-400">{index + 1}</span>
            <img className="w-10 h-10 rounded-full" src={user.avatar} alt={user.name} />
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-white flex items-center">
                {user.name}
                {index === 0 && <span className="ml-2">{ICONS.CROWN}</span>}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Level {user.level}</p>
            </div>
            <span className="font-bold text-sky-500 dark:text-sky-400">{user.points} XP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;