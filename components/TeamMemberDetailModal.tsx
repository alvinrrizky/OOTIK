import React from 'react';
import type { User, Activity } from '../types.ts';
import ActivityItem from './ActivityItem.tsx';

interface TeamMemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: User | null;
  activities: Activity[];
  onViewActivityDetails: (id: number) => void;
}

const TeamMemberDetailModal: React.FC<TeamMemberDetailModalProps> = ({ isOpen, onClose, member, activities, onViewActivityDetails }) => {
  if (!isOpen || !member) return null;

  // Filter activities to only show tasks for the current day
  const todayString = new Date('2025-10-25T12:00:00Z').toISOString().split('T')[0];
  const todaysActivities = activities.filter(activity => activity.assignee.id === member.id && activity.date === todayString);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl m-4 transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full ring-4 ring-offset-4 ring-violet-500 ring-offset-white dark:ring-offset-slate-800" />
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{member.position}</p>
            </div>
          </div>
          <button type="button" className="text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-2">List Of Activities</h4>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-11 gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <div className="col-span-5">Task</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-center hidden sm:block">Category</div>
                    <div className="col-span-2 text-right">Due Date</div>
                </div>
                 <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-64 overflow-y-auto">
                    {todaysActivities.length > 0 ? (
                        todaysActivities.map(activity => (
                        <ActivityItem key={activity.id} activity={activity} onViewDetails={onViewActivityDetails} />
                        ))
                    ) : (
                        <div className="text-center p-10 text-slate-500 dark:text-slate-400">
                        <p>Tidak ada aktivitas yang dijadwalkan untuk anggota ini hari ini.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end p-6 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onClose} className="text-slate-800 dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 rounded-lg text-sm px-5 py-2.5 text-center">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetailModal;
