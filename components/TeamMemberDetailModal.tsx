import React from 'react';
// Fix: Add .ts extension to import path.
import type { TeamMember } from '../types.ts';
// Fix: Add .tsx extension to import path.
import ProgressBar from './ProgressBar.tsx';
// Fix: Add .tsx extension to import path.
import { LEVEL_THRESHOLDS } from '../constants.tsx';

interface TeamMemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
}

const TeamMemberDetailModal: React.FC<TeamMemberDetailModalProps> = ({ isOpen, onClose, member }) => {
  if (!isOpen) {
    return null;
  }
  
  const currentLevelPoints = LEVEL_THRESHOLDS[member.level - 1] ?? 0;
  const nextLevelPoints = LEVEL_THRESHOLDS[member.level] ?? member.points;
  const pointsForLevel = member.points - currentLevelPoints;
  const pointsToNextLevel = nextLevelPoints - currentLevelPoints;

  const isUrl = (text: string) => {
    try {
        new URL(text);
        return true;
    } catch (_) {
        return false;
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div
        className={`
          relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl m-4
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Team Member Profile</h3>
          <button
            type="button"
            className="text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="text-center">
            <img className="w-24 h-24 rounded-full mb-4 ring-4 ring-offset-4 ring-violet-500 ring-offset-white dark:ring-offset-slate-800 mx-auto" src={member.avatar} alt={member.name} />
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h4>
            <div className="mt-2 text-center grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-violet-500">{member.level}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Level</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-500">{member.points}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total XP</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500">{member.activities.length}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Tasks</p>
              </div>
            </div>
             <div className="mt-4">
              <ProgressBar value={pointsForLevel} max={pointsToNextLevel} />
            </div>
          </div>
          
          <div className="mt-8">
             <h5 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activities</h5>
             <div className="space-y-4">
                {member.activities.length > 0 ? member.activities.map(activity => (
                    <div key={activity.id} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <p className="font-semibold text-slate-800 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
                        {activity.status === 'Completed' && activity.evidence && (
                            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded border border-emerald-200 dark:border-emerald-500/20">
                                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">Evidence:</p>
                                {activity.evidence.type === 'file' ? (
                                    <a 
                                      href={activity.evidence.content} 
                                      download={activity.evidence.fileName}
                                      className="flex items-center space-x-1 text-xs text-emerald-700 dark:text-emerald-300 hover:underline"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        <span>{activity.evidence.fileName}</span>
                                    </a>
                                ) : isUrl(activity.evidence.content) ? (
                                    <a href={activity.evidence.content} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 dark:text-emerald-300 hover:underline break-all">
                                        {activity.evidence.content}
                                    </a>
                                ) : (
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 italic">"{activity.evidence.content}"</p>
                                )}
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No recent activities.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetailModal;