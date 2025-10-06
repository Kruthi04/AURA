import React, { useState, useEffect } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [breathePhase, setBreathePhase] = useState<'in' | 'out'>('in');
  const [isVisible, setIsVisible] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    // Breathing cycle timing: 4s in, 4s out
    const breathingInterval = setInterval(() => {
      setBreathePhase(prev => {
        const newPhase = prev === 'in' ? 'out' : 'in';
        if (newPhase === 'in') {
          setCycleCount(count => count + 1);
        }
        return newPhase;
      });
    }, 4000);

    // Complete after 1.5 cycles (12 seconds total)
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete immediately to start transition
      onComplete();
    }, 12000);

    return () => {
      clearInterval(breathingInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-2000 ease-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="text-center">
        {/* Pulsing Circle */}
        <div className="relative mb-8 flex justify-center">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-blue-400 to-indigo-600 shadow-lg shadow-purple-500/30 transition-all duration-4000 ease-in-out ${
            breathePhase === 'in' 
              ? 'animate-breathe-in scale-125 opacity-90' 
              : 'animate-breathe-out scale-75 opacity-60'
          }`}>
            <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>
          </div>
        </div>

        {/* Breathing Text */}
        <div className="h-16 flex items-center justify-center">
          <h1 className={`text-4xl font-light text-white transition-all duration-1000 ${
            breathePhase === 'in' 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-70 transform translate-y-2'
          }`}>
            {breathePhase === 'in' ? 'Breathe In' : 'Breathe Out'}
          </h1>
        </div>

        {/* Subtle progress indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index < cycleCount 
                  ? 'bg-purple-400' 
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;