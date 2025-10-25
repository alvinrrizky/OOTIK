import React from 'react';

interface SplashScreenProps {
  isFadingOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isFadingOut }) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
        ${isFadingOut ? 'animate-slide-up-out' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Main loader container */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Center core with rotating icon */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow z-10">
            <i className="icon-users text-3xl text-white animate-rotate-center"></i>
          </div>

          {/* Orbit circles */}
          <div className="absolute w-full h-full">
            {/* First orbiting element - Indigo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-1">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <i className="icon-zap text-xl text-white"></i>
              </div>
            </div>

            {/* Second orbiting element - Pink */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-2">
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/50">
                <i className="icon-heart text-xl text-white"></i>
              </div>
            </div>

            {/* Third orbiting element - Amber */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <i className="icon-star text-xl text-white"></i>
              </div>
            </div>
          </div>

          {/* Outer glow ring */}
          <div className="absolute w-56 h-56 rounded-full border-4 border-purple-500/30 animate-pulse-glow"></div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Memuat...</h2>
          <p className="text-purple-200 text-sm">Sinergi dalam harmoni</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
