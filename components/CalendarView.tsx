import React, { useState } from 'react';
import type { Activity } from '../types.ts';

interface CalendarViewProps {
  activities: Activity[];
  onActivityClick: (id: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ activities, onActivityClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const activitiesByDate = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="p-4 sm:p-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">&lt;</button>
          <button onClick={nextMonth} className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div key={dayName} className="text-center py-2 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">{dayName}</div>
        ))}
        {days.map((d, i) => {
          const dateString = d.toISOString().split('T')[0];
          const dayActivities = activitiesByDate[dateString] || [];
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.toDateString() === new Date().toDateString();

          return (
            <div key={i} className={`relative p-2 h-32 overflow-y-auto bg-white dark:bg-slate-800 ${!isCurrentMonth ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
              <time dateTime={dateString} className={`text-sm font-semibold ${isToday ? 'bg-violet-600 text-white rounded-full flex items-center justify-center w-6 h-6' : isCurrentMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                {d.getDate()}
              </time>
              <div className="mt-1 space-y-1">
                {dayActivities.map(activity => (
                  <button
                    key={activity.id}
                    onClick={() => onActivityClick(activity.id)}
                    className="w-full text-left text-xs p-1 rounded bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-500/30 truncate"
                  >
                    {activity.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
