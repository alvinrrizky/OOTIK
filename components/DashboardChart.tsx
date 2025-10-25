
import React, { useState, useEffect } from 'react';
import type { Activity } from '../types.ts';

interface DashboardChartProps {
  activities: Activity[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ activities }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Animate bars shortly after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date('2025-10-25T12:00:00Z');
  const todayDateString = today.toISOString().split('T')[0];

  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateString = date.toISOString().split('T')[0];
    return { day, dateString, count: 0 };
  });

  const completedActivities = activities.filter(a => a.status === 'Completed');
  completedActivities.forEach(activity => {
    const dayData = weekData.find(d => d.dateString === activity.date);
    if (dayData) {
      dayData.count++;
    }
  });

  const maxCount = Math.max(...weekData.map(d => d.count), 4); // Set a minimum max of 4 for better visual scale

  return (
    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aktivitas Mingguan</h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tugas Selesai (7 Hari Terakhir)</span>
      </div>

      <div className="grid grid-cols-12 gap-x-2">
        {/* Y-Axis Labels */}
        <div className="col-span-1 flex flex-col justify-between items-end h-48 text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">
          <span>{maxCount}</span>
          <span>{Math.ceil(maxCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="col-span-11 relative h-48">
          {/* Grid Lines */}
          <div className="absolute top-0 left-0 w-full h-full grid grid-rows-2">
            <div className="border-b border-dashed border-slate-200 dark:border-slate-700"></div>
            <div className="border-b border-dashed border-slate-200 dark:border-slate-700"></div>
          </div>

          {/* Bars */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between items-end gap-x-2 md:gap-x-4 px-2">
            {weekData.map(({ day, count, dateString }, index) => {
              const barHeight = (count / maxCount) * 100;
              const isToday = dateString === todayDateString;
              return (
                <div key={index} className="flex-1 group relative h-full flex items-end">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <span className="bg-slate-800 dark:bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded-md shadow-lg">
                      {count} {count === 1 ? 'tugas' : 'tugas'}
                    </span>
                  </div>
                  {/* Bar */}
                  <div
                    className={`
                      w-full rounded-t-md bg-gradient-to-t from-violet-500 to-sky-400
                      group-hover:from-violet-400 group-hover:to-sky-300
                      transition-all duration-500 ease-out
                      ${isToday ? 'ring-2 ring-offset-2 ring-violet-500 ring-offset-white dark:ring-offset-slate-800/50' : ''}
                    `}
                    style={{
                      height: isAnimated ? `${barHeight}%` : '0%',
                      minHeight: isAnimated && count > 0 ? '4px' : '0px',
                      transitionDelay: `${index * 50}ms`
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer for Y-Axis */}
        <div className="col-span-1"></div>

        {/* X-Axis Labels */}
        <div className="col-span-11 flex justify-between text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 px-2">
            {weekData.map(({ day }, index) => (
              <span key={index} className="flex-1">{day}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
