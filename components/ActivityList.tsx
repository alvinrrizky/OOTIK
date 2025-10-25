import React, { useState } from 'react';
import type { Activity, ActivityStatus } from '../types.ts';
import ActivityItem from './ActivityItem.tsx';

interface ActivityListProps {
  activities: Activity[];
  onViewDetails: (id: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onViewDetails }) => {
  const [filter, setFilter] = useState<'All' | ActivityStatus>('In Progress');
  
  const filteredActivities = activities
    .filter(activity => {
      if (filter === 'All') return activity.status !== 'Completed';
      if (filter === 'In Progress') return activity.status === 'In Progress' || activity.status === 'To Do';
      return activity.status === filter;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filterButtons: ('All' | ActivityStatus)[] = ['In Progress', 'Pending', 'Completed', 'All'];

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Aktivitas</h3>
        <div className="flex space-x-2">
          {filterButtons.map(btnFilter => (
            <button
                key={btnFilter}
                onClick={() => setFilter(btnFilter)}
                className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors ${
                filter === btnFilter
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
            >
              {btnFilter === 'In Progress' ? 'Active' : btnFilter}
            </button>
          ))}
        </div>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-11 gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="col-span-5">Task</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2 text-center hidden sm:block">Category</div>
        <div className="col-span-2 text-right">Due Date</div>
      </div>
      
      {/* List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[60vh] overflow-y-auto">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} onViewDetails={onViewDetails} />
          ))
        ) : (
          <div className="text-center p-10 text-slate-500 dark:text-slate-400">
            <p className="font-semibold">No activities found.</p>
            <p className="text-sm">Enjoy your clean slate!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
