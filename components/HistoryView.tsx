
import React, { useState } from 'react';
import type { Activity, ActivityCategory } from '../types.ts';
import ActivityItem from './ActivityItem.tsx';
import { CATEGORIES } from '../constants.tsx';

interface HistoryViewProps {
  activities: Activity[];
  onViewDetails: (id: number) => void;
  onGenerateSummary: (date: Date) => void;
  isSummaryLoading: boolean;
}

const HistoryView: React.FC<HistoryViewProps> = ({ activities, onViewDetails, onGenerateSummary, isSummaryLoading }) => {
    const [filterCategory, setFilterCategory] = useState<ActivityCategory | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1];
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        name: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(e.target.value, 10);
        setSelectedDate(prev => new Date(prev.getFullYear(), newMonth, 1));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value, 10);
        setSelectedDate(prev => new Date(newYear, prev.getMonth(), 1));
    };

    const filteredActivities = activities
        .filter(activity => {
            const activityDate = new Date(activity.date);
            const userTimezoneOffset = activityDate.getTimezoneOffset() * 60000;
            const localActivityDate = new Date(activityDate.getTime() + userTimezoneOffset);
            return localActivityDate.getFullYear() === selectedDate.getFullYear() &&
                   localActivityDate.getMonth() === selectedDate.getMonth();
        })
        .filter(activity => filterCategory === 'All' || activity.category === filterCategory)
        .filter(activity => activity.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full md:w-auto flex-grow">
                        <input
                            type="text"
                            placeholder="Search tasks in this month..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-72 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2.5"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                         <select
                            value={selectedDate.getMonth()}
                            onChange={handleMonthChange}
                            className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2.5"
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedDate.getFullYear()}
                            onChange={handleYearChange}
                            className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2.5"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                         <button 
                            onClick={() => onGenerateSummary(selectedDate)} 
                            disabled={isSummaryLoading}
                            className="flex-shrink-0 flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md disabled:bg-sky-300 dark:disabled:bg-sky-800 disabled:cursor-not-allowed"
                        >
                            {isSummaryLoading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <span className="text-lg">👤</span>
                            )}
                            <span>{isSummaryLoading ? 'Generating...' : 'Rekap Aktivitas Saya'}</span>
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilterCategory('All')}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${filterCategory === 'All' ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setFilterCategory(cat.name)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${filterCategory === cat.name ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="grid grid-cols-11 gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Task</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center hidden sm:block">Category</div>
                <div className="col-span-2 text-right">Due Date</div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map(activity => (
                            <ActivityItem key={activity.id} activity={activity} onViewDetails={onViewDetails} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-center py-10 text-slate-500 dark:text-slate-400">
                            <div>
                                <p>No tasks found for the selected period.</p>
                                <p className="text-sm">Try adjusting the date or filters.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
