
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

  // BMI Calculation
  const bmiData = useMemo(() => {
    const rawWeight = parseFloat(userStats.weight) || 70;
    let heightM = 1.75;
    
    if (userStats.height.includes("'")) {
        const parts = userStats.height.split("'");
        const feet = parseFloat(parts[0]) || 5;
        const inches = parseFloat(parts[1]) || 10;
        heightM = (feet * 30.48 + inches * 2.54) / 100;
    } else {
        heightM = (parseFloat(userStats.height) || 175) / 100;
    }

    const bmi = rawWeight / (heightM * heightM);
    return { bmi: bmi.toFixed(1) };
  }, [userStats.weight, userStats.height]);

  const displayWeight = userStats.weight === '165' ? '165' : (userStats.weight || '165');
  const displayHeight = userStats.height === "5'10" || userStats.height === "178" ? '178' : userStats.height;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F9F9F9] dark:bg-[#000000] text-light-text dark:text-white font-sans animate-fade-in transition-colors duration-300">
      
      {/* Background Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

      {/* Header precisely matching screenshot */}
      <div className="flex flex-col items-center pt-10 pb-6 px-6 relative z-20">
          <div className="text-center">
              <p className="text-[10px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-[0.4em] mb-1">ZPD Internal Database</p>
              <h1 className="text-[28px] font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none italic transform -skew-x-12">CONFIDENTIAL DOSSIER</h1>
          </div>

          <button 
            onClick={() => onNavigate(Screen.HOME)}
            className="absolute top-6 right-8 size-10 rounded-full bg-gray-200/50 dark:bg-white/10 flex items-center justify-center shadow-sm active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-400 text-xl font-bold">close</span>
          </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40 flex flex-col gap-6 items-center perspective-1000">
          
          {/* ANIMATED TRANSPARENT CASE FILE ZPD ID CARD */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-full max-w-[340px] aspect-[216/133] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-blue-400/30 bg-white/40 dark:bg-white/5 backdrop-blur-xl transition-all duration-1000 transform 
                ${showId ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} 
                ${isHovered ? 'rotate-x-2 rotate-y-2 scale-[1.02]' : 'rotate-0 scale-100 animate-float-card'}`}
          >
              
              {/* Animation Layer: Scanning Laser */}
              <div className="absolute inset-0 z-30 pointer-events-none animate-id-scan opacity-40">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_cyan]"></div>
              </div>

              {/* Animation Layer: Holographic Glint */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] animate-hologram-glint"></div>

              {/* Pattern Background - Faint Confidential Watermark */}
              <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none flex items-center justify-center overflow-hidden">
                  <span className="text-[120px] font-black uppercase rotate-[-25deg] tracking-tighter whitespace-nowrap animate-pulse-slow">CONFIDENTIAL</span>
              </div>

              {/* Precinct Watermark Patch */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.07] pointer-events-none scale-150">
                  <span className="material-symbols-outlined text-[180px]">shield</span>
              </div>

              {/* Blue Identification Bar */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-600 shadow-[0_-4px_12px_rgba(37,99,235,0.3)]"></div>

              <div className="p-6 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                      <div className="flex gap-2.5 items-center">
                          <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white/20 animate-precinct-pulse">
                              <span className="material-symbols-outlined text-white text-lg filled">shield</span>
                          </div>
                          <div>
                              <h3 className="text-base font-black uppercase tracking-tighter leading-none italic text-gray-800 dark:text-white drop-shadow-sm">Zootopia</h3>
                              <p className="text-[5px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Police Department</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">FILE NO. 0{activeCharacter.level}95</p>
                          <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md border border-white/10">
                              RANK {activeCharacter.level}
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-5 mt-auto pb-1">
                      <div className="relative group">
                          <div className="size-16 rounded-2xl overflow-hidden border-2 border-white/60 dark:border-white/20 shadow-lg bg-white/20 dark:bg-black/40 shrink-0 relative z-10">
                              <img src={activeCharacter.image} className="w-full h-full object-cover object-top grayscale contrast-125" alt="Cadet" />
                              {/* Biometric Scan Overlay */}
                              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay animate-pulse"></div>
                          </div>
                          {/* Pulsing Status dot */}
                          <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 z-20 animate-ping"></div>
                          <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 z-20"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                          <p className="text-[7px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-0.5 animate-fade-in delay-500">Assigned Cadet</p>
                          <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase leading-none tracking-tighter truncate mb-2 italic drop-shadow-md">{displayName}</h2>
                          <div className="flex gap-3">
                              <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Age</span>
                                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-200">{ageLabel} YRS</span>
                              </div>
                              <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Gender</span>
                                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-200">{genderLabel}</span>
                              </div>
                              <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Partner</span>
                                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{partnerName.split(' ')[0]}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-3 gap-3 w-full">
              <ProfileStatCard label="Missions" value={workoutLogs.length.toString()} icon="open_in_full" color="text-gray-800" bg="bg-[#E2E8F0] dark:bg-blue-900/10" />
              <ProfileStatCard label="Streak" value="5" icon="local_fire_department" color="text-[#F97316]" bg="bg-[#FEE2E2] dark:bg-orange-900/10" unit="Days" />
              <ProfileStatCard label="Academy XP" value={activeCharacter.xp.toString()} icon="stars" color="text-[#D97706]" bg="bg-[#FEF3C7] dark:bg-yellow-900/10" />
          </div>

          {/* PHYSICAL ANALYSIS */}
          <div className="w-full max-w-[340px] bg-[#FFFBEB] dark:bg-yellow-900/5 rounded-[2.5rem] border-2 border-dashed border-yellow-300 dark:border-yellow-700/50 p-8 relative overflow-hidden flex flex-col items-center">
              <button 
                onClick={() => onNavigate(Screen.BIOMETRICS)}
                className="absolute top-5 right-7 text-gray-300 dark:text-yellow-900/50 hover:text-yellow-600 transition-colors"
              >
                  <span className="material-symbols-outlined text-2xl">more_horiz</span>
              </button>
              
              <h3 className="text-[11px] font-black text-[#422006] dark:text-white uppercase tracking-[0.5em] mb-10">PHYSICAL ANALYSIS</h3>
              
              <div className="flex justify-between w-full items-end px-2">
                  <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Height</span>
                      <div className="w-full border-b-2 border-dashed border-yellow-300 dark:border-yellow-900/40 text-center pb-1">
                        <span className="text-xl font-black text-gray-800 dark:text-white tracking-tighter">{displayHeight}</span>
                      </div>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 mx-4">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Weight</span>
                      <div className="w-full border-b-2 border-dashed border-yellow-300 dark:border-yellow-900/40 text-center pb-1">
                        <span className="text-xl font-black text-gray-800 dark:text-white tracking-tighter">{displayWeight}</span>
                      </div>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">BMI</span>
                      <div className="w-full border-b-2 border-dashed border-yellow-300 dark:border-yellow-900/40 text-center pb-1">
                        <span className="text-xl font-black text-gray-800 dark:text-white tracking-tighter">{bmiData.bmi}</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* FIELD COMMENDATIONS */}
          <div className="w-full mt-4">
            <div className="flex items-center gap-2 px-2 mb-6">
                <span className="size-2 rounded-full bg-yellow-400 animate-pulse"></span>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.35em]">FIELD COMMENDATIONS</h3>
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
        @keyframes hologram-glint {
            0% { transform: translateX(-150%) skewX(-20deg); }
            30% { transform: translateX(200%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
        }
        .animate-hologram-glint {
            animation: hologram-glint 6s ease-in-out infinite;
        }
        @keyframes precinct-pulse {
            0%, 100% { box-shadow: 0 0 0 rgba(37, 99, 235, 0); }
            50% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.4); }
        }
        .animate-precinct-pulse {
            animation: precinct-pulse 2.5s infinite;
        }
        @keyframes float-card {
            0%, 100% { transform: translateY(0) rotateX(0) rotateY(0); }
            33% { transform: translateY(-3px) rotateX(1deg) rotateY(-1deg); }
            66% { transform: translateY(1px) rotateX(-1deg) rotateY(1deg); }
        }
        .animate-float-card {
            animation: float-card 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const ProfileStatCard: React.FC<{ label: string; value: string; icon: string; color: string; bg: string; unit?: string }> = ({ label, value, icon, color, bg, unit }) => (
    <div className={`${bg} rounded-[2rem] p-5 h-36 flex flex-col justify-between shadow-sm border border-white dark:border-white/5 transition-transform active:scale-95 group`}>
        <div className={`size-9 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center transition-transform group-hover:scale-110`}>
            <span className={`material-symbols-outlined text-lg ${color} filled`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div>
            <div className="flex items-baseline gap-1">
                <p className={`text-2xl font-black text-gray-800 dark:text-white tracking-tighter leading-none`}>{value}</p>
                {unit && <span className="text-[9px] font-black text-gray-400 uppercase">{unit}</span>}
            </div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1.5">{label}</p>
        </div>
    </div>
);

const Badge: React.FC<{ icon: string; name: string; earned: boolean }> = ({ icon, name, earned }) => (
    <div className="flex flex-col items-center gap-3 shrink-0 group">
        <div className={`size-16 rounded-full flex items-center justify-center transition-all duration-500 relative ${earned ? 'bg-[#FEF3C7] dark:bg-yellow-900/20 border-white dark:border-yellow-700 shadow-xl shadow-yellow-200/50 group-hover:scale-110' : 'bg-gray-100 dark:bg-white/5 opacity-30 grayscale'}`}>
            <span className={`material-symbols-outlined text-2xl ${earned ? 'text-[#D97706] filled' : 'text-gray-400'}`} style={{ fontVariationSettings: earned ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
            {earned && (
                 <div className="absolute inset-0 rounded-full border-4 border-yellow-200/30 animate-pulse-slow"></div>
            )}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${earned ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>{name}</span>
    </div>
);

export default Profile;
