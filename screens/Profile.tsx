
import React, { useState, useEffect, useMemo } from 'react';
import { Screen, Character, UserStats, ActivityLog } from '../types';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
  userStats: UserStats;
  activeCharacter: Character;
  unitSystem: 'metric' | 'imperial';
  workoutLogs: ActivityLog[];
  meditationLogs: ActivityLog[];
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, userStats, activeCharacter, unitSystem, workoutLogs, meditationLogs }) => {
  const [showId, setShowId] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowId(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Formatting display values
  const displayName = userStats.name ? userStats.name.toUpperCase() : 'CADET ROOKIE';
  const ageLabel = userStats.age || '24';
  const genderLabel = userStats.gender ? userStats.gender.toUpperCase() : 'MALE';
  const partnerName = activeCharacter.name.toUpperCase();

  // Performance Calculations
  const missionCount = workoutLogs.length;
  const academyXP = activeCharacter.xp;
  const streakDays = 5; // Derived or mock value

  // BMI Calculation
  const bmiData = useMemo(() => {
    let weightKg = parseFloat(userStats.weight) || 70;
    
    // Handle Imperial to Metric conversion for standard BMI formula
    if (unitSystem === 'imperial') {
        weightKg = weightKg * 0.453592;
    }

    let heightM = 1.75;
    if (userStats.height.includes("'")) {
        const parts = userStats.height.split("'");
        const feet = parseFloat(parts[0]) || 5;
        const inches = parseFloat(parts[1]) || 10;
        heightM = (feet * 30.48 + inches * 2.54) / 100;
    } else {
        heightM = (parseFloat(userStats.height) || 175) / 100;
    }

    const bmi = weightKg / (heightM * heightM);
    return { bmi: bmi.toFixed(1) };
  }, [userStats.weight, userStats.height, unitSystem]);

  const displayWeight = userStats.weight || '165';
  const displayHeight = userStats.height || "5'10";

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans animate-fade-in transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col items-center pt-10 pb-4 px-6 relative z-20">
          <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.4em] mb-1">ZPD Internal Database</p>
              <h1 className="text-[28px] font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none italic transform -skew-x-12">CONFIDENTIAL DOSSIER</h1>
          </div>

          <button 
            onClick={() => onNavigate(Screen.HOME)}
            className="absolute top-6 right-8 size-10 rounded-full bg-gray-200/50 dark:bg-dark-surface flex items-center justify-center shadow-sm active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-300 text-xl font-bold">close</span>
          </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-44 flex flex-col gap-6 items-center perspective-1000">
          
          {/* ANIMATED CASE FILE ZPD ID CARD - EXPANDED & NO BLUE BAR */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-full aspect-[216/133] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-blue-400/20 bg-white/40 dark:bg-dark-surface/60 backdrop-blur-xl transition-all duration-1000 transform 
                ${showId ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} 
                ${isHovered ? 'rotate-x-2 rotate-y-2 scale-[1.01]' : 'rotate-0 scale-100'}`}
          >
              {/* Scanning Laser */}
              <div className="absolute inset-0 z-30 pointer-events-none animate-id-scan opacity-30">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]"></div>
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none flex items-center justify-center overflow-hidden">
                  <span className="text-[120px] font-black uppercase rotate-[-25deg] tracking-tighter whitespace-nowrap">CONFIDENTIAL</span>
              </div>

              <div className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                      <div className="flex gap-2.5 items-center">
                          <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                              <span className="material-symbols-outlined text-white text-lg filled">shield</span>
                          </div>
                          <div>
                              <h3 className="text-base font-black uppercase tracking-tighter leading-none italic text-gray-800 dark:text-white">Zootopia</h3>
                              <p className="text-[5px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-dark-muted leading-none">Police Department</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[7px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest mb-1">FILE NO. 0{activeCharacter.level}95</p>
                          <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">
                              RANK {activeCharacter.level}
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-5 mt-auto pb-4">
                      <div className="relative group">
                          <div className="size-20 rounded-2xl overflow-hidden border-2 border-white/60 dark:border-white/20 shadow-lg bg-white/20 dark:bg-black/40 shrink-0 relative z-10">
                              <img src={activeCharacter.image} className="w-full h-full object-cover object-top grayscale contrast-125" alt="Cadet" />
                              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay animate-pulse"></div>
                          </div>
                          <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 z-20"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                          <p className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Assigned Cadet</p>
                          <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase leading-none tracking-tighter truncate mb-2 italic">{displayName}</h2>
                          <div className="flex gap-3">
                              <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Age</span>
                                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-200">{ageLabel} YRS</span>
                              </div>
                              <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Gender</span>
                                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-200">{genderLabel}</span>
                              </div>
                              <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Partner</span>
                                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{partnerName.split(' ')[0]}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* PERFORMANCE STATS GRID - REDUCED SIZE */}
          <div className="grid grid-cols-3 gap-3 w-full">
              <ProfileStatCard 
                label="Missions" 
                value={missionCount.toString()} 
                icon="open_in_full" 
                color="text-blue-600" 
                bg="bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" 
              />
              <ProfileStatCard 
                label="Streak" 
                value={streakDays.toString()} 
                icon="local_fire_department" 
                color="text-pink-600" 
                bg="bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800" 
                unit="Days" 
              />
              <ProfileStatCard 
                label="Academy XP" 
                value={academyXP.toString()} 
                icon="stars" 
                color="text-yellow-600" 
                bg="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800" 
              />
          </div>

          {/* PHYSICAL ANALYSIS - UPDATED LOOK */}
          <div className="w-full bg-white dark:bg-dark-surface rounded-[2.5rem] border-2 border-dashed border-yellow-400/50 dark:border-yellow-700/50 p-6 relative overflow-hidden flex flex-col items-center">
              <button 
                onClick={() => onNavigate(Screen.BIOMETRICS)}
                className="absolute top-5 right-7 text-gray-400 dark:text-dark-muted hover:text-yellow-600 transition-colors"
              >
                  <span className="material-symbols-outlined text-2xl">more_horiz</span>
              </button>
              
              <h3 className="text-[11px] font-black text-[#422006] dark:text-yellow-400 uppercase tracking-[0.5em] mb-8">PHYSICAL ANALYSIS</h3>
              
              <div className="flex justify-between w-full items-start px-2">
                  <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest mb-2">Height</span>
                      <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tighter">{displayHeight}</span>
                          {unitSystem === 'metric' && <span className="text-[8px] font-bold text-gray-400 uppercase">cm</span>}
                      </div>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 mx-4">
                      <span className="text-[8px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest mb-2">Weight</span>
                      <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tighter">{displayWeight}</span>
                          <span className="text-[8px] font-bold text-gray-400 uppercase">{unitSystem === 'metric' ? 'kg' : 'lbs'}</span>
                      </div>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest mb-2">BMI</span>
                      <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tighter">{bmiData.bmi}</span>
                  </div>
              </div>
          </div>

          {/* FIELD COMMENDATIONS */}
          <div className="w-full mt-2">
            <div className="flex items-center gap-2 px-2 mb-4">
                <span className="size-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-[0.35em]">FIELD COMMENDATIONS</h3>
            </div>
            <div className="flex justify-between items-center px-2">
                <Badge icon="military_tech" name="ROOKIE" earned={true} />
                <Badge icon="bolt" name="FAST" earned={true} />
                <Badge icon="diamond" name="ELITE" earned={false} />
                <Badge icon="local_police" name="HERO" earned={false} />
            </div>
          </div>

      </div>

      <style>{`
        @keyframes id-scan {
            0% { top: -10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 110%; opacity: 0; }
        }
        .animate-id-scan {
            animation: id-scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

const ProfileStatCard: React.FC<{ label: string; value: string; icon: string; color: string; bg: string; unit?: string }> = ({ label, value, icon, color, bg, unit }) => (
    <div className={`${bg} rounded-[2rem] p-4 h-28 flex flex-col justify-between shadow-sm border transition-transform active:scale-95 group`}>
        <div className={`size-8 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center`}>
            <span className={`material-symbols-outlined text-base ${color} filled`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div>
            <div className="flex items-baseline gap-0.5">
                <p className={`text-xl font-black text-gray-800 dark:text-white tracking-tighter leading-none`}>{value}</p>
                {unit && <span className="text-[8px] font-black text-gray-400 dark:text-dark-muted uppercase">{unit}</span>}
            </div>
            <p className="text-[7px] font-black text-gray-400 dark:text-dark-muted uppercase tracking-widest leading-none mt-1">{label}</p>
        </div>
    </div>
);

const Badge: React.FC<{ icon: string; name: string; earned: boolean }> = ({ icon, name, earned }) => (
    <div className="flex flex-col items-center gap-2 shrink-0 group">
        <div className={`size-14 rounded-full flex items-center justify-center transition-all duration-500 relative ${earned ? 'bg-[#FEF3C7] dark:bg-yellow-900/30 border-white dark:border-yellow-700 shadow-xl shadow-yellow-200/30 group-hover:scale-105' : 'bg-gray-100 dark:bg-white/5 opacity-30 grayscale'}`}>
            <span className={`material-symbols-outlined text-xl ${earned ? 'text-[#D97706] filled' : 'text-gray-400 dark:text-dark-muted'}`} style={{ fontVariationSettings: earned ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
            {earned && (
                 <div className="absolute inset-0 rounded-full border-2 border-yellow-200/30 animate-pulse-slow"></div>
            )}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${earned ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-dark-muted'}`}>{name}</span>
    </div>
);

export default Profile;
