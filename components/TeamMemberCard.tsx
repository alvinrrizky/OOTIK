
import React from 'react';
import type { User, Activity } from '../types.ts';

const TeamMemberCard: React.FC<{ member: User; activities: Activity[]; onClick: () => void; selectedDate: string }> = ({ member, activities, onClick, selectedDate }) => {

  // Filter activities to only include tasks for the selected day for the stats
  const dailyActivities = activities.filter(activity => activity.date === selectedDate);

  const todoCount = dailyActivities.filter(a => a.status === 'To Do').length;
  const inProgressCount = dailyActivities.filter(a => a.status === 'In Progress').length;
  const pendingCount = dailyActivities.filter(a => a.status === 'Pending').length;
  const completedCount = dailyActivities.filter(a => a.status === 'Completed').length;

  return (
    <div 
        className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col"
        onClick={onClick}
    >
      <div className="flex flex-col items-center text-center flex-grow">
        <img className="w-20 h-20 rounded-full mb-4 ring-4 ring-offset-4 ring-violet-500 ring-offset-white dark:ring-offset-slate-800" src={member.avatar} alt={member.name} />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate" title={member.position}>{member.position}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 w-full grid grid-cols-4 text-center">
          <div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{todoCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">To Do</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-500">{inProgressCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-500">{completedCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
          </div>
        </div>
    </div>
  );
};

export default TeamMemberCard;
