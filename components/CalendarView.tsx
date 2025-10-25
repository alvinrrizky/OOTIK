
import React, { useState, useRef, useEffect } from 'react';
import type { Activity } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';
import FullCalendarModal from './FullCalendarModal.tsx';

interface CalendarViewProps {
  activities: Activity[];
  onActivityClick: (id: number) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ activities, onActivityClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date('2025-10-25T12:00:00Z'));
  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);
  const [weekReferenceDate, setWeekReferenceDate] = useState(new Date('2025-10-25T12:00:00Z'));
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsCalendarPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusStyles = {
    'To Do': 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    'Completed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    'Re-Open': 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
  };

  const getWeekDays = (refDate: Date): Date[] => {
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - refDate.getDay());
    const week = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });
    return week;
  };

  const week = getWeekDays(weekReferenceDate);

  const goToPreviousWeek = () => {
    setWeekReferenceDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7);
        return newDate;
    });
  };

  const goToNextWeek = () => {
    setWeekReferenceDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
    });
  };
  
  const goToToday = () => {
      const today = new Date('2025-10-25T12:00:00Z');
      setSelectedDate(today);
      setWeekReferenceDate(today);
  };

  const handleDateSelectFromModal = (date: Date) => {
      setSelectedDate(date);
      setWeekReferenceDate(date);
      setIsCalendarPopoverOpen(false);
  };

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const activitiesForSelectedDate = activities.filter(
    activity => activity.date === selectedDateString
  );
  
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
  });
  const formattedSelectedWeekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <>
        <div className="h-full flex flex-col bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex-1"></div>
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 flex-grow">
                    <button onClick={goToPreviousWeek} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex-shrink-0 text-slate-500 dark:text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="hidden sm:flex space-x-2">
                        {week.map(day => {
                            const isSelected = day.toDateString() === selectedDate.toDateString();
                            const isToday = day.toDateString() === new Date('2025-10-25T12:00:00Z').toDateString();
                            return (
                                <button 
                                    key={day.toISOString()} 
                                    onClick={() => setSelectedDate(day)} 
                                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg w-28 h-24 transition-colors ${
                                        isSelected 
                                        ? 'bg-violet-600 text-white shadow-md' 
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <p className={`text-xs uppercase ${isSelected ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400'}`}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                    <p className={`font-bold text-3xl mt-1 ${
                                        isToday && !isSelected ? 'text-violet-600 dark:text-violet-400' : ''
                                    }`}>{day.getDate()}</p>
                                </button>
                            )
                        })}
                    </div>
                    <div className="sm:hidden text-center font-bold text-lg text-slate-700 dark:text-slate-200">
                        {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
                    </div>
                    <button onClick={goToNextWeek} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex-shrink-0 text-slate-500 dark:text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="flex items-center space-x-2 flex-1 justify-end">
                    <button onClick={goToToday} className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex-shrink-0">Today</button>
                    <div className="relative" ref={popoverRef}>
                        <button onClick={() => setIsCalendarPopoverOpen(prev => !prev)} className="px-3 py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                         {isCalendarPopoverOpen && (
                            <FullCalendarModal
                                isOpen={isCalendarPopoverOpen}
                                onClose={() => setIsCalendarPopoverOpen(false)}
                                activities={activities}
                                onDateSelect={handleDateSelectFromModal}
                                initialDate={selectedDate}
                            />
                        )}
                    </div>
                </div>
            </div>
            
            <div className="p-6 sm:p-8 flex-1 min-h-0 flex flex-col">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    {formattedSelectedDate}
                    <span className="ml-3 text-2xl font-normal text-slate-500 dark:text-slate-400">{formattedSelectedWeekday}</span>
                </h1>

                <div className="mt-8 flex-1">
                    {activitiesForSelectedDate.length > 0 ? (
                        <ul className="space-y-4 h-full overflow-y-auto pr-2">
                            {activitiesForSelectedDate.map(activity => (
                                <li key={activity.id}>
                                    <button
                                        onClick={() => onActivityClick(activity.id)}
                                        className="w-full text-left p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200 flex items-start space-x-4"
                                    >
                                        <span className="text-2xl pt-1 flex-shrink-0">{CATEGORIES.find(c => c.name === activity.category)?.icon ?? '📝'}</span>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{activity.title}</p>
                                            {activity.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activity.description}</p>}
                                            
                                            <div className="flex items-center space-x-3 mt-3">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[activity.status]}`}>
                                                    {activity.status}
                                                </span>
                                                {activity.time && (
                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{formatTime(activity.time)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* FIX: Removed XP/points display as it's not part of the Activity type. */}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center h-full">
                            <div className="mx-auto w-16 h-16 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="mt-5 text-lg font-semibold text-slate-600 dark:text-slate-300">Tidak ada activity</p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tidak ada jadwal kegiatan untuk hari ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
  );
};

export default CalendarView;
