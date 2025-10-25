
import React from 'react';
import type { Activity, Evidence } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onComplete: (id: number) => void;
  onPending: (id: number) => void;
  onSetInProgress: (id: number) => void;
  onReopen: (id: number) => void;
  onBackToTodo: (id: number) => void;
  onDelete: (id: number) => void;
}

const EvidenceDisplay: React.FC<{ evidence: Evidence, title: string, color: 'emerald' | 'yellow' | 'sky' }> = ({ evidence, title, color }) => {
    const isUrl = (text: string) => {
        try {
            new URL(text);
            return true;
        } catch (_) {
            return false;
        }
    };
    
    const colorStyles = {
        emerald: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
        yellow: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-300',
        sky: 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300',
    };

    return (
        <div>
            <h4 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
            <div className={`p-3 rounded-lg border ${colorStyles[color]}`}>
                {evidence.type === 'file' ? (
                    <a
                        href={evidence.content}
                        download={evidence.fileName}
                        className="flex items-center space-x-2 text-sm hover:underline"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>{evidence.fileName}</span>
                    </a>
                ) : isUrl(evidence.content) ? (
                    <a href={evidence.content} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline break-all">
                        {evidence.content}
                    </a>
                ) : (
                    <p className="text-sm italic">"{evidence.content}"</p>
                )}
            </div>
        </div>
    );
};


const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ isOpen, onClose, activity, onComplete, onPending, onSetInProgress, onReopen, onBackToTodo, onDelete }) => {
  if (!isOpen || !activity) return null;

  const categoryIcon = CATEGORIES.find(c => c.name === activity.category)?.icon ?? '📝';

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-2xl mr-3">{categoryIcon}</span>
            <h3 className="inline-block text-xl font-bold text-slate-900 dark:text-white align-middle">{activity.title}</h3>
          </div>
          <button type="button" className="text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="text-sm text-slate-600 dark:text-slate-300 prose dark:prose-invert max-w-none">
            <p>{activity.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Assignee</p>
              <div className="flex items-center space-x-2 mt-1">
                <img src={activity.assignee.avatar} alt={activity.assignee.name} className="w-6 h-6 rounded-full"/>
                <span className="text-slate-800 dark:text-slate-100">{activity.assignee.name}</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Due Date & Time</p>
              <p className="text-slate-800 dark:text-slate-100 mt-1">
                {formatDate(activity.date)}
                {activity.time && ` at ${formatTime(activity.time)}`}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Category</p>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{activity.category}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Status</p>
              <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{activity.status}</p>
            </div>
          </div>

          {activity.status === 'Pending' && activity.evidence && (
            <EvidenceDisplay evidence={activity.evidence} title="Reason for Pending" color="yellow" />
          )}

          {activity.evidence && (activity.status === 'Completed' || activity.status === 'Re-Open') && (
            <EvidenceDisplay 
              evidence={activity.evidence} 
              title={activity.status === 'Re-Open' ? 'Evidence of Initial Completion' : 'Evidence of Completion'} 
              color="emerald" 
            />
          )}

          {activity.reopenEvidence && activity.status === 'Completed' && (
             <EvidenceDisplay 
              evidence={activity.reopenEvidence} 
              title="Evidence of Re-Completion" 
              color="emerald" 
            />
          )}
        </div>
        <div className="flex items-center justify-between p-6 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onDelete(activity.id)}
            className="text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Delete
          </button>
          
          <div className="flex items-center space-x-2">
              {activity.status === 'To Do' && (
                  <button onClick={() => onSetInProgress(activity.id)} className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    In Progress
                  </button>
              )}
              {activity.status === 'In Progress' && (
                <>
                  <button onClick={() => onBackToTodo(activity.id)} className="text-slate-800 dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 rounded-lg text-sm px-5 py-2.5 text-center">
                    Back to To Do
                  </button>
                  <button onClick={() => onPending(activity.id)} className="text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Pending
                  </button>
                  <button onClick={() => onComplete(activity.id)} className="text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Complete Task
                  </button>
                </>
              )}
              {activity.status === 'Re-Open' && (
                  <button onClick={() => onComplete(activity.id)} className="text-white bg-emerald-600 hover:bg-emerald-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Complete Task
                  </button>
              )}
              {activity.status === 'Pending' && (
                  <button onClick={() => onSetInProgress(activity.id)} className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    In Progress
                  </button>
              )}
              {activity.status === 'Completed' && !activity.reopened && (
                <button
                  onClick={() => onReopen(activity.id)}
                  className="text-white bg-sky-500 hover:bg-sky-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Re-open Task
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
