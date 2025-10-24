import React, { useState } from 'react';
// Fix: Add .ts extension to import path.
import type { Activity, ActivityCategory } from '../types.ts';
// Fix: Add .tsx extension to import path.
import ActivityItem from './ActivityItem.tsx';
// Fix: Add .tsx extension to import path.
import { CATEGORIES } from '../constants.tsx';

interface ActivityListProps {
  activities: Activity[];
  onViewDetails: (id: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onViewDetails }) => {
    const [filterCategory, setFilterCategory] = useState<ActivityCategory | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredActivities = activities
        .filter(activity => filterCategory === 'All' || activity.category === filterCategory)
        .filter(activity => activity.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2.5"
                        />
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
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Task</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center hidden sm:block">Category</div>
                <div className="col-span-1 text-center">XP</div>
                <div className="col-span-2 text-right">Due Date</div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredActivities.length > 0 ? (
                    filteredActivities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} onViewDetails={onViewDetails} />
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                        <p>No tasks found.</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityList;
