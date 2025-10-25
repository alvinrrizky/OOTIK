
import React, { useState } from 'react';
import type { User, Activity } from '../types.ts';
import TeamMemberCard from './TeamMemberCard.tsx';
import ActivityItem from './ActivityItem.tsx';

interface TeamViewProps {
  teamData: User[];
  activities: Activity[];
  onViewActivityDetails: (id: number) => void;
  onGenerateSummary: (date: string) => void;
  isSummaryLoading: boolean;
}

const TeamView: React.FC<TeamViewProps> = ({ teamData, activities, onViewActivityDetails, onGenerateSummary, isSummaryLoading }) => {
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date('2025-10-25T12:00:00Z').toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeamData = teamData.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedMember) {
    const memberActivities = activities.filter(
      (act) => act.assignee.id === selectedMember.id && act.date === selectedDate
    );

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full animate-fade-in">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <img src={selectedMember.avatar} alt={selectedMember.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedMember.name}'s Tasks for {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedMember.position}</p>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                    &larr; Back to Team
                </button>
            </div>
             <div className="grid grid-cols-11 gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Task</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center hidden sm:block">Category</div>
                <div className="col-span-2 text-right">Due Date</div>
            </div>
             <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {memberActivities.length > 0 ? (
                        memberActivities.map(activity => (
                            <ActivityItem key={activity.id} activity={activity} onViewDetails={onViewActivityDetails} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-center py-10 text-slate-500 dark:text-slate-400">
                            <p>No activities scheduled for this day.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="animate-fade-in">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Overview</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
                 <div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2.5"
                    />
                </div>
                <div className="w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search member..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 p-2.5"
                    />
                </div>
                <button 
                    onClick={() => onGenerateSummary(selectedDate)} 
                    disabled={isSummaryLoading}
                    className="flex-shrink-0 flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md disabled:bg-sky-300 dark:disabled:bg-sky-800 disabled:cursor-not-allowed"
                >
                    {isSummaryLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span className="text-xl">✨</span>
                    )}
                    <span className="hidden sm:inline">{isSummaryLoading ? 'Generating...' : 'Rekap Aktivitas Tim'}</span>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeamData.map(member => (
            <TeamMemberCard 
                key={member.id} 
                member={member} 
                activities={activities.filter(a => a.assignee.id === member.id)}
                selectedDate={selectedDate}
                onClick={() => setSelectedMember(member)} 
            />
          ))}
        </div>
      </div>
  );
};

export default TeamView;
