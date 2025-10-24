import React from 'react';

interface SplashScreenProps {
  isFadingOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isFadingOut }) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900
        ${isFadingOut ? 'animate-slide-up-out' : ''}
      `}
    >
      <div className="text-center animate-pulse-logo">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-sky-500">
          OOTIK
        </h1>
        <p className="mt-2 text-lg font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
          Output Of TIK
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;