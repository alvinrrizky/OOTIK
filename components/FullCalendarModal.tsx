import React, { useState, useMemo, useEffect } from 'react';
import type { Activity } from '../types.ts';

interface FullCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

// Helper function moved outside the component to avoid re-creation on every render.
const generateCalendarDays = (date: Date) => {
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...
    const daysInMonth = lastDayOfMonth.getDate();
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek; i > 0; i--) {
        days.push({ date: new Date(year, month - 1, prevMonthLastDay - i + 1), isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const endDayOfWeek = lastDayOfMonth.getDay();
    // Loop runs from 1 to less than 7 - endDayOfWeek. If endDayOfWeek is Saturday(6), it doesn't run.
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
};

const FullCalendarModal: React.FC<FullCalendarModalProps> = ({ isOpen, onClose, activities, onDateSelect, initialDate }) => {
  const [displayDate, setDisplayDate] = useState(initialDate);

  useEffect(() => {
    if (isOpen) {
      setDisplayDate(initialDate);
    }
  }, [isOpen, initialDate]);

  // Hooks must be called at the top level, before any conditional returns.
  const activityDates = useMemo(() => new Set(activities.map(a => a.date)), [activities]);
  const calendarDays = useMemo(() => generateCalendarDays(displayDate), [displayDate]);

  // This component is now a popover, so we don't return null. The parent controls visibility.
  
  const handlePrevMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-md font-bold text-slate-800 dark:text-white">
                {displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
        <div className="p-2">
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px">
                {calendarDays.map(({ date, isCurrentMonth }, index) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    // FIX: Compare dates using local date components to avoid timezone issues.
                    // This prevents the dot from appearing on the wrong day.
                    const localDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    const hasActivity = activityDates.has(localDateString);

                    return (
                        <div key={index} className="relative aspect-square">
                            <button
                                onClick={() => onDateSelect(date)}
                                className={`w-full h-full flex items-center justify-center flex-col transition-colors rounded-lg
                                    ${isCurrentMonth ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}
                                    hover:bg-slate-100 dark:hover:bg-slate-700/50
                                `}
                            >
                                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold
                                    ${isToday ? 'bg-violet-600 text-white' : ''}
                                `}>
                                    {date.getDate()}
                                </span>
                            </button>
                            {hasActivity && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
  );
};
export default FullCalendarModal;