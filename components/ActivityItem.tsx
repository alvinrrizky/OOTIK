
import React from 'react';
import type { Activity } from '../types.ts';
import { CATEGORIES, ICONS } from '../constants.tsx';

interface ActivityItemProps {
  activity: Activity;
  onViewDetails: (id: number) => void;
}

const statusStyles = {
  'To Do': 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  'Re-Open': 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onViewDetails }) => {
  const categoryIcon = CATEGORIES.find(c => c.name === activity.category)?.icon ?? '📝';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Add time to date object to prevent timezone issues
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <div
      onClick={() => onViewDetails(activity.id)}
      className="grid grid-cols-11 gap-4 px-4 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-200"
    >
      <div className="col-span-5 flex items-center space-x-3">
        <span className="text-xl">{categoryIcon}</span>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{activity.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">{activity.description}</p>
        </div>
      </div>
      <div className="col-span-2 flex justify-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[activity.status]}`}>
          {activity.status}
        </span>
      </div>
      <div className="col-span-2 text-center text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
        {activity.category}
      </div>
      <div className="col-span-2 text-right text-sm text-slate-600 dark:text-slate-300">
        <span>{formatDate(activity.date)}</span>
        {activity.time && (
            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-end mt-1">
                {ICONS.CLOCK}
                <span className="ml-1">{formatTime(activity.time)}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
