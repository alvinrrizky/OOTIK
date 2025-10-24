import React, { useEffect } from 'react';
// Fix: Add .ts extension to import path.
import type { Notification } from '../types.ts';

interface NotificationProps {
  notification: Notification;
  onRemove: (id: number) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const typeStyles: { [key in Notification['type']]: string } = {
    points: 'from-sky-500/80 to-slate-800/80 text-sky-100 dark:to-slate-900/80',
    levelUp: 'from-violet-500/80 to-slate-800/80 text-violet-100 dark:to-slate-900/80',
    achievement: 'from-amber-500/80 to-slate-800/80 text-amber-100 dark:to-slate-900/80',
  };

  return (
    <div
      className={`
        flex items-center p-3 mb-3 rounded-lg shadow-lg border border-slate-700/50
        bg-gradient-to-r ${typeStyles[notification.type]}
        w-full max-w-sm transition-all animate-fade-in-down backdrop-blur-sm
      `}
    >
      <div className="flex-shrink-0 w-6 h-6 mr-3">{notification.icon}</div>
      <p className="flex-1 font-semibold text-sm">{notification.message}</p>
      <button onClick={() => onRemove(notification.id)} className="ml-4 text-slate-200 hover:text-white">
        &times;
      </button>
    </div>
  );
};

interface NotificationCenterProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-5 right-5 z-50">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;