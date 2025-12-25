
import React, { useState, useEffect } from 'react';
import { Screen, Character } from '../types';

interface MeditationTimerProps {
  onNavigate: (screen: Screen) => void;
  sessionData: { title: string; icon: string; duration?: string } | null;
  activeCharacter: Character;
  onComplete?: (data: any) => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ onNavigate, sessionData, activeCharacter, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (sessionData?.duration) {
      const [min, sec] = sessionData.duration.split(':').map(Number);
      setInitialTime((min || 0) * 60 + (sec || 0));
      setTimeLeft((min || 0) * 60 + (sec || 0));
    }
  }, [sessionData]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      finishSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const attemptStop = () => {
    const elapsed = initialTime - timeLeft;
    if (elapsed < 300) { // 5 mins
        setIsActive(false);
        setShowConfirm(true);
    } else {
        finishSession();
    }
  };

  const finishSession = () => {
    const elapsed = initialTime - timeLeft;
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    let msg = "";
    if (elapsed < 300) msg = "Giving up so soon? Even Flash takes longer to say 'Hello'. Come back when you're ready to zen!";
    else if (elapsed < 600) msg = "Not bad, rookie. You're starting to find your center. Keep that Mystic Springs vibe!";
    else msg = "Omm... You are one with the fluff! Yax would be proud of this focus!";

    setFeedback(msg);
    setTimeout(() => {
        if (onComplete) onComplete({ ...sessionData, duration: formattedDuration });
        else onNavigate(Screen.HOME);
    }, 3000);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#E6FFFA] dark:bg-gray-900 font-sans transition-all duration-1000">
      
      {/* Background Zen Leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <span className="absolute top-10 left-10 text-4xl animate-float" style={{ animationDelay: '0s' }}>🍃</span>
          <span className="absolute top-40 right-20 text-2xl animate-float" style={{ animationDelay: '1s' }}>🍃</span>
          <span className="absolute bottom-20 left-1/4 text-3xl animate-float" style={{ animationDelay: '2s' }}>🍃</span>
      </div>

      <div className="relative z-20 flex items-center justify-between px-6 pt-10 pb-2">
        <div className="size-10"></div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-1">Mystic Springs Oasis</span>
            <h2 className="text-xl font-black text-teal-900 dark:text-white uppercase">{sessionData?.title || 'Mindfulness'}</h2>
        </div>
        <button 
          onClick={attemptStop}
          className="size-10 rounded-full bg-white/40 dark:bg-white/10 shadow-sm backdrop-blur-md flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-teal-900 dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {feedback ? (
              <div className="text-center px-10 animate-bounce-in">
                  <span className="text-6xl mb-6 block">✨</span>
                  <p className="text-xl font-black text-teal-800 dark:text-white italic leading-snug">"{feedback}"</p>
              </div>
          ) : (
              <>
                  <div className={`text-9xl mb-8 transform transition-all duration-[4s] ${isActive ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}`}>
                      {isActive ? '🧘' : '🦥'}
                  </div>
                  <div className="text-[100px] font-black text-[#0F766E] dark:text-teal-100 tracking-tighter leading-none mb-6">
                      {formatTime(timeLeft)}
                  </div>
                  <p className="text-teal-600 font-black uppercase text-xs tracking-widest">{isActive ? 'Finding Balance...' : 'Ready to Breathe?'}</p>
              </>
          )}
      </div>

      <div className="relative z-10 p-10 pb-16 flex items-center justify-center gap-4">
           <button onClick={() => setIsActive(!isActive)} className={`h-20 w-48 rounded-2xl flex items-center justify-center shadow-lg border-b-4 ${isActive ? 'bg-yellow-400 border-yellow-600 text-yellow-900' : 'bg-teal-500 border-teal-700 text-white'}`}>
               <span className="material-symbols-outlined text-4xl filled">{isActive ? 'pause' : 'play_arrow'}</span>
           </button>
           <button onClick={attemptStop} className="size-20 rounded-2xl bg-white/50 dark:bg-white/10 border-b-4 border-gray-300 text-gray-500 flex items-center justify-center shadow-md active:border-b-0">
               <span className="material-symbols-outlined text-3xl filled">stop</span>
           </button>
      </div>

      {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
              <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-2xl border-4 border-teal-500">
                  <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase">Abandoning Zen?</h3>
                  <p className="text-sm font-bold text-gray-500 mb-8">"Giving up so soon? Even Flash takes longer to say 'Hello'. Stay a bit longer?"</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={() => { setShowConfirm(false); setIsActive(true); }} className="w-full py-4 bg-teal-500 text-white font-black rounded-xl uppercase">Resume Peace</button>
                      <button onClick={() => { setShowConfirm(false); finishSession(); }} className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl uppercase">End Anyway</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MeditationTimer;
