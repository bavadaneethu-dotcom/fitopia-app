
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Screen, Character, UserStats } from '../types';

interface UserDataProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  userStats: UserStats;
  setUserStats: (stats: UserStats) => void;
}

const UserData: React.FC<UserDataProps> = ({ onNavigate, activeCharacter, userStats, setUserStats }) => {
  const [heightUnit, setHeightUnit] = useState<'FT' | 'CM'>('FT');
  const [weightUnit, setWeightUnit] = useState<'LBS' | 'KG'>('KG');
  
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (userStats.dob) {
          const parts = userStats.dob.split('-');
          if (parts.length === 3) {
              setDobYear(parts[0]);
              setDobMonth(parts[1]);
              setDobDay(parts[2]);
          }
      }
  }, []);

  const updateStats = (field: keyof UserStats, value: string) => {
      setUserStats({ ...userStats, [field]: value });
  };

  const handleDateChange = (part: 'd' | 'm' | 'y', value: string) => {
      // Only allow digits
      if (!/^\d*$/.test(value)) return;

      let d = part === 'd' ? value : dobDay;
      let m = part === 'm' ? value : dobMonth;
      let y = part === 'y' ? value : dobYear;

      if (part === 'd') {
          if (value.length > 2) return;
          const valNum = parseInt(value);
          
          // STRICT VALIDATION: Day must be between 1 and 31
          if (!isNaN(valNum)) {
              if (valNum > 31) return; // Prevent input greater than 31
              if (value === '00') return; // Prevent 00
          }

          d = value;
          // Auto-focus next
          if (value.length === 2) monthRef.current?.focus();
      }

      if (part === 'm') {
          if (value.length > 2) return;
          const valNum = parseInt(value);

          // STRICT VALIDATION: Month must be between 1 and 12
          if (!isNaN(valNum)) {
              if (valNum > 12) return; // Prevent input greater than 12
              if (value === '00') return; // Prevent 00
          }

          m = value;
          // Auto-focus next
          if (value.length === 2) yearRef.current?.focus();
      }

      if (part === 'y') {
          if (value.length > 4) return;
          y = value;
      }

      // Update state
      if (part === 'd') setDobDay(d);
      if (part === 'm') setDobMonth(m);
      if (part === 'y') setDobYear(y);

      // Update main userStats object
      const newDob = `${y}-${m}-${d}`;
      updateStats('dob', newDob);

      // Calculate Age automatically if date is valid
      if (y.length === 4 && m.length >= 1 && d.length >= 1) {
          const yearNum = parseInt(y);
          const monthNum = parseInt(m) - 1;
          const dayNum = parseInt(d);
          
          const birthDate = new Date(yearNum, monthNum, dayNum);
          const today = new Date();
          
          if (!isNaN(birthDate.getTime()) && birthDate.getFullYear() === yearNum) {
              let age = today.getFullYear() - birthDate.getFullYear();
              const mDiff = today.getMonth() - birthDate.getMonth();
              if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
              }
              if (age >= 0 && age < 150) {
                  updateStats('age', age.toString());
              }
          }
      }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 3) {
        updateStats('age', val);
    }
  };

  const bmiData = useMemo(() => {
    const w = parseFloat(userStats.weight);
    let h = 0;
    if (heightUnit === 'CM') {
        h = parseFloat(userStats.height) / 100;
    } else {
        const parts = userStats.height.split("'");
        const feet = parseFloat(parts[0]);
        const inches = parts.length > 1 ? parseFloat(parts[1]) : 0;
        if (!isNaN(feet)) {
            h = (feet * 30.48 + inches * 2.54) / 100;
        }
    }
    let weightKg = w;
    if (weightUnit === 'LBS') {
        weightKg = w * 0.453592;
    }
    if (!w || !h || h === 0) return null;
    const bmi = weightKg / (h * h);
    const score = parseFloat(bmi.toFixed(1));
    let label = '';
    let color = '';
    let quote = '';
    let character = '';

    if (score < 18.5) {
        label = 'Underweight';
        color = 'text-blue-500';
        quote = "Whoa there! You're lighter than a dandelion fluff.";
        character = 'Clawhauser';
    } else if (score >= 18.5 && score < 25) {
        label = 'Healthy Weight';
        color = 'text-green-500';
        quote = "Sly fox! You're in peak ZPD condition.";
        character = 'Nick Wilde';
    } else if (score >= 25 && score < 30) {
        label = 'Overweight';
        color = 'text-orange-500';
        quote = "Had a few too many Pawpsicles? Don't sweat it.";
        character = 'Judy Hopps';
    } else {
        label = 'Obese';
        color = 'text-red-500';
        quote = "Life isn't a cartoon musical where you sing and get fit.";
        character = 'Chief Bogo';
    }
    return { score, label, color, quote, character };
  }, [userStats.weight, userStats.height, weightUnit, heightUnit]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#1a1a1a] text-light-text dark:text-white font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col items-center w-full pt-8 px-6 relative z-20 bg-white dark:bg-[#1a1a1a]">
        <div className="w-full flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate(Screen.CHARACTER_SELECT)}
              className="size-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">arrow_back</span>
            </button>
            
            <div className="px-4 py-1.5">
                <span className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.2em]">Step 2 of 5</span>
            </div>

            <div className="size-12"></div> 
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-8 rounded-full bg-yellow-400 shadow-sm"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-36">

        {/* Intro Text */}
        <div className="py-2 mt-4">
          <h1 className="text-[34px] font-black text-center text-[#4A4A4A] dark:text-white leading-[0.95] tracking-tight mb-6">
            Confirm your <br/> <span className="text-[#6D5D4B] dark:text-gray-400">identity</span>
          </h1>
          
          <div className="flex gap-4 bg-[#F9F9F9] dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm mb-6">
             <div className="size-10 rounded-full bg-cover bg-top border-2 border-yellow-400 shrink-0" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
             <p className="text-sm font-bold leading-relaxed text-gray-600 dark:text-gray-300 italic">
               "{activeCharacter?.onboardingMessages.dataSetup || "I need your stats for the ZPD files. Accuracy matters!"}"
             </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6">

          {/* Name Input */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Cadet Identity</h3>
            <div className="relative flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16">
              <span className="pl-6 material-symbols-outlined text-gray-400">badge</span>
              <input
                className="w-full h-full bg-transparent border-none px-4 text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none"
                placeholder="Nick Wilde"
                type="text"
                value={userStats.name}
                onChange={(e) => updateStats('name', e.target.value)}
              />
            </div>
          </div>

          {/* Date of Birth Input */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Date of Origin</h3>
            <div className="flex gap-3">
                {/* Day */}
                <div className="relative flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16 group">
                    <input
                        ref={dayRef}
                        className="w-full h-full bg-transparent border-none px-4 text-center text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 outline-none"
                        placeholder="DD"
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={dobDay}
                        onChange={(e) => handleDateChange('d', e.target.value)}
                    />
                    <span className="absolute bottom-1 w-full text-center text-[8px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">Day</span>
                </div>
                
                {/* Month */}
                <div className="relative flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16 group">
                    <input
                        ref={monthRef}
                        className="w-full h-full bg-transparent border-none px-4 text-center text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 outline-none"
                        placeholder="MM"
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={dobMonth}
                        onChange={(e) => handleDateChange('m', e.target.value)}
                    />
                    <span className="absolute bottom-1 w-full text-center text-[8px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">Month</span>
                </div>

                {/* Year */}
                <div className="relative flex-[1.5] bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16 group">
                    <input
                        ref={yearRef}
                        className="w-full h-full bg-transparent border-none px-4 text-center text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 outline-none"
                        placeholder="YYYY"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={dobYear}
                        onChange={(e) => handleDateChange('y', e.target.value)}
                    />
                    <span className="absolute bottom-1 w-full text-center text-[8px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">Year</span>
                </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Biological Classification</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => updateStats('gender', 'male')}
                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  userStats.gender === 'male'
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <span className={`material-symbols-outlined text-[32px] ${userStats.gender === 'male' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>male</span>
                <span className={`font-bold ${userStats.gender === 'male' ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500'}`}>Male</span>
              </button>
              <button
                onClick={() => updateStats('gender', 'female')}
                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all shadow-sm ${
                  userStats.gender === 'female'
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <span className={`material-symbols-outlined text-[32px] ${userStats.gender === 'female' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>female</span>
                <span className={`font-bold ${userStats.gender === 'female' ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500'}`}>Female</span>
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Age</h3>
            <div className="relative flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16">
              <input
                className="w-full h-full bg-transparent border-none px-6 text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 outline-none"
                placeholder="25"
                type="number"
                value={userStats.age}
                onChange={handleAgeChange}
                maxLength={3}
                max="999"
              />
              <span className="pr-6 text-gray-400 font-bold text-sm uppercase tracking-wide">years</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between items-end mb-2 ml-1">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Vertical Clearance</h3>
              <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                <button onClick={() => setHeightUnit('FT')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${heightUnit === 'FT' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}>FT</button>
                <button onClick={() => setHeightUnit('CM')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${heightUnit === 'CM' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}>CM</button>
              </div>
            </div>
            <div className="relative flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16">
              <input
                className="w-full h-full bg-transparent border-none px-6 text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 outline-none"
                placeholder={heightUnit === 'FT' ? "5'10" : "178"}
                type={heightUnit === 'CM' ? "number" : "text"}
                value={userStats.height}
                onChange={(e) => updateStats('height', e.target.value)}
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-end mb-2 ml-1">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Physical Mass</h3>
              <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                <button onClick={() => setWeightUnit('LBS')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${weightUnit === 'LBS' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}>LBS</button>
                <button onClick={() => setWeightUnit('KG')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${weightUnit === 'KG' ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' : 'text-gray-400'}`}>KG</button>
              </div>
            </div>
            <div className="relative flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors h-16">
              <input
                className="w-full h-full bg-transparent border-none px-6 text-xl font-bold text-gray-800 dark:text-white focus:ring-0 placeholder:text-gray-300 outline-none"
                placeholder="70"
                type="number"
                value={userStats.weight}
                onChange={(e) => updateStats('weight', e.target.value)}
              />
              <span className="pr-6 text-gray-400 font-bold text-sm uppercase tracking-wide">{weightUnit}</span>
            </div>
          </div>

          {/* BMI Card */}
          {bmiData && (
            <div className="bg-[#fdfbf7] dark:bg-[#1a202c] rounded-2xl p-5 border-2 border-dashed border-gray-300 dark:border-gray-600 relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated BMI</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter">{bmiData.score}</h2>
                            <span className={`text-sm font-bold uppercase tracking-wide ${bmiData.color}`}>{bmiData.label}</span>
                        </div>
                    </div>
                    <div className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-500">monitor_weight</span>
                    </div>
                </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] z-30 pt-16">
        <button
          onClick={() => onNavigate(Screen.GOAL_SELECTION)}
          className="flex w-full items-center justify-center rounded-full h-16 bg-[#FACC15] hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all gap-3"
        >
          <span className="material-symbols-outlined text-xl filled">fingerprint</span>
          Confirm Identity
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default UserData;
