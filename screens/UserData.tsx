import React, { useState } from 'react';
import { Screen, Character } from '../types';

interface UserDataProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
}

const UserData: React.FC<UserDataProps> = ({ onNavigate, activeCharacter }) => {
  // State for form fields
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('25');
  const [height, setHeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<'FT' | 'CM'>('FT');
  const [weight, setWeight] = useState<string>('70');
  const [weightUnit, setWeightUnit] = useState<'LBS' | 'KG'>('KG');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'active'>('light');

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden pb-24 bg-light-bg dark:bg-dark-bg animate-fade-in">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pt-6 justify-between sticky top-0 z-20 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md">
        <button
          onClick={() => onNavigate(Screen.CHARACTER_SELECT)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <div className="flex items-center gap-2 pr-12 flex-1 justify-center">
            {activeCharacter && (
                <div className="size-8 rounded-full bg-cover bg-top border border-light-primary dark:border-dark-primary" style={{ backgroundImage: `url("${activeCharacter.image}")` }}></div>
            )}
            <h2 className="text-light-text dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Profile Setup</h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-3 px-6 pt-2 pb-4">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-light-text dark:text-dark-text text-sm font-bold leading-normal">Step 2 of 5</p>
          <span className="material-symbols-outlined text-light-primary dark:text-dark-primary text-sm">pets</span>
        </div>
        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2 w-full overflow-hidden">
          <div className="h-full rounded-full bg-light-primary dark:bg-dark-primary transition-all duration-500 ease-out" style={{ width: '40%' }}></div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6">

        {/* Intro Text - Personalized */}
        <div className="py-2">
          <h1 className="text-3xl font-black text-light-text dark:text-white mb-4 tracking-tight">Basic Info</h1>
          <div className="flex gap-4 bg-light-surface dark:bg-dark-surface p-5 rounded-2xl border border-light-primary/20 dark:border-dark-primary/20 shadow-sm">
             <span className="text-2xl pt-1">📝</span>
             <p className="text-light-text dark:text-dark-text text-base font-bold leading-relaxed italic">
               "{activeCharacter?.onboardingMessages.dataSetup || "I need your stats for the ZPD files. Accuracy matters when we're chasing bad guys!"}"
             </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 pt-4">

          {/* Gender Selection */}
          <div>
            <h3 className="text-light-text dark:text-white text-lg font-bold leading-tight tracking-tight mb-3">Gender</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGender('male')}
                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  gender === 'male'
                    ? 'border-light-primary dark:border-dark-primary bg-light-surface dark:bg-dark-surface'
                    : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`material-symbols-outlined text-[32px] ${gender === 'male' ? 'text-light-primary dark:text-dark-primary' : 'text-gray-400'}`}>male</span>
                <span className={`font-bold ${gender === 'male' ? 'text-light-primary dark:text-dark-primary' : 'text-gray-500 dark:text-gray-400'}`}>Male</span>
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  gender === 'female'
                    ? 'border-light-primary dark:border-dark-primary bg-light-surface dark:bg-dark-surface'
                    : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`material-symbols-outlined text-[32px] ${gender === 'female' ? 'text-light-primary dark:text-dark-primary' : 'text-gray-400'}`}>female</span>
                <span className={`font-bold ${gender === 'female' ? 'text-light-primary dark:text-dark-primary' : 'text-gray-500 dark:text-gray-400'}`}>Female</span>
              </button>
            </div>
          </div>

          {/* Age Input */}
          <div>
            <h3 className="text-light-text dark:text-white text-lg font-bold leading-tight tracking-tight mb-2">Age</h3>
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border-2 border-transparent focus-within:border-light-primary/50 dark:focus-within:border-dark-primary/50 transition-colors h-16">
              <input
                className="w-full h-full bg-transparent border-none px-6 text-xl font-bold text-light-text dark:text-white focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                placeholder="25"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <span className="pr-6 text-gray-400 font-bold text-sm uppercase tracking-wide">years</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-light-text dark:text-white text-lg font-bold leading-tight tracking-tight">Height</h3>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setHeightUnit('FT')}
                  className={`px-3 py-1 rounded-md text-xs font-bold shadow-sm transition-all ${heightUnit === 'FT' ? 'bg-white dark:bg-gray-600 text-light-text dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >FT</button>
                <button
                  onClick={() => setHeightUnit('CM')}
                  className={`px-3 py-1 rounded-md text-xs font-bold shadow-sm transition-all ${heightUnit === 'CM' ? 'bg-white dark:bg-gray-600 text-light-text dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >CM</button>
              </div>
            </div>
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border-2 border-transparent focus-within:border-light-primary/50 dark:focus-within:border-dark-primary/50 transition-colors h-16">
              <input
                className="w-full h-full bg-transparent border-none px-6 text-xl font-bold text-light-text dark:text-white focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                placeholder={heightUnit === 'FT' ? "5'10" : "178"}
                type={heightUnit === 'CM' ? "number" : "text"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-light-text dark:text-white text-lg font-bold leading-tight tracking-tight">Weight</h3>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setWeightUnit('LBS')}
                  className={`px-3 py-1 rounded-md text-xs font-bold shadow-sm transition-all ${weightUnit === 'LBS' ? 'bg-white dark:bg-gray-600 text-light-text dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >LBS</button>
                <button
                  onClick={() => setWeightUnit('KG')}
                  className={`px-3 py-1 rounded-md text-xs font-bold shadow-sm transition-all ${weightUnit === 'KG' ? 'bg-white dark:bg-gray-600 text-light-text dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >KG</button>
              </div>
            </div>
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border-2 border-transparent focus-within:border-light-primary/50 dark:focus-within:border-dark-primary/50 transition-colors h-16">
              <input
                className="w-full h-full bg-transparent border-none px-6 text-xl font-bold text-light-text dark:text-white focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                placeholder="70"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="pr-6 text-gray-400 font-bold text-sm uppercase tracking-wide">{weightUnit}</span>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <h3 className="text-light-text dark:text-white text-lg font-bold leading-tight tracking-tight mb-3 pt-2">Activity Level</h3>
            <div className="flex flex-col gap-3 pb-8">
              {/* Option 1: Sedentary */}
              <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer shadow-sm transition-all group ${activityLevel === 'sedentary' ? 'bg-light-surface dark:bg-dark-surface border-light-primary dark:border-dark-primary' : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <input
                  className="peer sr-only"
                  name="activity"
                  type="radio"
                  checked={activityLevel === 'sedentary'}
                  onChange={() => setActivityLevel('sedentary')}
                />
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-colors ${activityLevel === 'sedentary' ? 'bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  <span className="material-symbols-outlined">bedtime</span>
                </div>
                <div className="ml-4 flex flex-col flex-1">
                  <span className="text-base font-bold text-light-text dark:text-white">Sloth Pace</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sedentary (Little or no exercise)</span>
                </div>
              </label>

              {/* Option 2: Moderate */}
              <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer shadow-sm transition-all group ${activityLevel === 'light' ? 'bg-light-surface dark:bg-dark-surface border-light-primary dark:border-dark-primary' : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <input
                  className="peer sr-only"
                  name="activity"
                  type="radio"
                  checked={activityLevel === 'light'}
                  onChange={() => setActivityLevel('light')}
                />
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-colors ${activityLevel === 'light' ? 'bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  <span className="material-symbols-outlined">directions_walk</span>
                </div>
                <div className="ml-4 flex flex-col flex-1">
                  <span className="text-base font-bold text-light-text dark:text-white">Rabbit Reflexes</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Lightly Active (1-3 days/week)</span>
                </div>
              </label>

              {/* Option 3: Active */}
              <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer shadow-sm transition-all group ${activityLevel === 'active' ? 'bg-light-surface dark:bg-dark-surface border-light-primary dark:border-dark-primary' : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <input
                  className="peer sr-only"
                  name="activity"
                  type="radio"
                  checked={activityLevel === 'active'}
                  onChange={() => setActivityLevel('active')}
                />
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-colors ${activityLevel === 'active' ? 'bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <div className="ml-4 flex flex-col flex-1">
                  <span className="text-base font-bold text-light-text dark:text-white">Cheetah Speed</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Very Active (6-7 days/week)</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-light-bg via-light-bg to-transparent dark:from-dark-bg dark:via-dark-bg z-20">
        <button
          onClick={() => onNavigate(Screen.GOAL_SELECTION)}
          className="flex w-full items-center justify-center rounded-full bg-light-primary dark:bg-dark-primary py-4 px-6 text-light-text dark:text-dark-bg shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 hover:brightness-105 active:scale-[0.98] transition-all"
        >
          <span className="text-lg font-bold leading-tight tracking-[0.015em] mr-2">Continue</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default UserData;