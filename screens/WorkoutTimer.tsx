
import React, { useState, useEffect } from 'react';
import { Screen, Character } from '../types';

interface WorkoutTimerProps {
  onNavigate: (screen: Screen) => void;
  sessionData: { title: string; icon: string; color?: string } | null;
  activeCharacter: Character;
  onComplete?: (data: any) => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ onNavigate, sessionData, activeCharacter, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isActive) interval = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const attemptStop = () => {
    if (timeElapsed < 300) { // 5 mins
        setIsActive(false);
        setShowConfirm(true);
    } else {
        finishSession();
    }
  };

  const finishSession = () => {
    let msg = "";
    if (timeElapsed < 300) msg = "DISMISSED? Already? You wouldn't last a minute in the Tundratown district! Get back out there!";
    else if (timeElapsed < 900) msg = "Good hustle! You're moving faster than a meter maid on a sugar rush!";
    else msg = "OUTSTANDING! That is peak ZPD agility! You're ready for the big cases, rookie!";

    setFeedback(msg);
    setTimeout(() => {
        if (onComplete) onComplete({ ...sessionData, duration: formatTime(timeElapsed), calories: Math.floor(timeElapsed * 0.15) });
        else onNavigate(Screen.HOME);
    }, 3000);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F7FAFC] dark:bg-gray-900 font-sans transition-colors duration-300">
      
      <div className="relative z-20 flex items-center justify-between px-6 pt-10 pb-4">
        <div className="size-10"></div>
        <div className="flex flex-col items-center">
            <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Academy Assignment</p>
            <h1 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{sessionData?.title || 'Workout'}</h1>
        </div>
        <button 
          onClick={attemptStop}
          className="size-10 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-gray-800 dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {feedback ? (
              <div className="text-center px-10 animate-bounce-in">
                  <div className="size-24 rounded-full border-4 border-yellow-400 mx-auto mb-6 overflow-hidden bg-white"><img src="https://static.wikia.nocookie.net/zootopia/images/e/e5/Chief_Bogo_Render.png" alt="Bogo" className="w-full h-full object-cover" /></div>
                  <p className="text-2xl font-black text-gray-800 dark:text-white italic">"{feedback}"</p>
              </div>
          ) : (
              <>
                  <div className="text-8xl mb-8 filter drop-shadow-xl animate-float">
                      {isActive ? '🚔' : '🥕'}
                  </div>
                  <div className="text-[100px] font-black text-gray-800 dark:text-white leading-none tracking-tighter mb-12">
                      {formatTime(timeElapsed)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-[300px]">
                      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center shadow-md">
                          <span className="material-symbols-outlined text-red-500 animate-pulse">favorite</span>
                          <span className="text-2xl font-black">142</span>
                      </div>
                      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center shadow-md">
                          <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                          <span className="text-2xl font-black">{(timeElapsed * 0.15).toFixed(0)}</span>
                      </div>
                  </div>
              </>
          )}
      </div>

      <div className="p-10 pb-16 flex items-center justify-center gap-4 z-10">
          <button onClick={() => setIsActive(!isActive)} className={`h-20 w-48 rounded-2xl flex items-center justify-center gap-2 shadow-lg border-b-4 ${isActive ? 'bg-yellow-400 border-yellow-600 text-yellow-900' : 'bg-green-500 border-green-700 text-white'}`}>
              <span className="material-symbols-outlined text-3xl filled">{isActive ? 'pause' : 'play_arrow'}</span>
              <span className="text-lg font-black">{isActive ? 'PAUSE' : 'HUSTLE'}</span>
          </button>
          <button onClick={attemptStop} className="size-20 rounded-2xl bg-white border-b-4 border-gray-300 text-gray-400 flex items-center justify-center shadow-sm active:border-b-0">
              <span className="material-symbols-outlined text-3xl filled">stop</span>
          </button>
      </div>

      {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
              <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-2xl border-4 border-red-500">
                  <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase">Desertion?</h3>
                  <p className="text-sm font-bold text-gray-500 mb-8">"You wouldn't last a minute in the Tundratown district with that effort! Are you sure you want to clock out early?"</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={() => { setShowConfirm(false); setIsActive(true); }} className="w-full py-4 bg-yellow-400 text-black font-black rounded-xl uppercase">Back to Duty</button>
                      <button onClick={() => { setShowConfirm(false); finishSession(); }} className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl uppercase">Clock Out Anyway</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default WorkoutTimer;
