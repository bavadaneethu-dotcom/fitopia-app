
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

const Profile: React.FC<ProfileProps> = ({ onNavigate, userStats, activeCharacter }) => {
  const [showId, setShowId] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowId(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const displayName = userStats.name ? userStats.name.toUpperCase() : 'CADET ROOKIE';
  const ageLabel = userStats.age || '24';
  const genderLabel = userStats.gender ? userStats.gender.toUpperCase() : 'MALE';
  const partnerName = activeCharacter.name.split(' ')[0].toUpperCase(); 

  const bmiValue = useMemo(() => {
    const weightVal = parseFloat(userStats.weight) || 165;
    const heightVal = parseFloat(userStats.height) || 178;
    const weightKg = userStats.weight === '165' ? weightVal * 0.453592 : weightVal;
    const heightM = heightVal / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  }, [userStats.weight, userStats.height]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-[#F2F2F2] dark:bg-[#000000] text-gray-900 dark:text-white font-sans">
      
      <div className="flex flex-col items-center pt-16 pb-6 px-6 relative z-20">
          <div className="text-center">
              <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-1">ZPD Internal Database</p>
              <h1 className="text-[34px] font-black text-zpd-navy dark:text-white uppercase tracking-tighter leading-none italic transform -skew-x-12">CONFIDENTIAL DOSSIER</h1>
          </div>
          <button onClick={() => onNavigate(Screen.HOME)} className="absolute top-8 right-10 size-11 rounded-full bg-gray-200/80 dark:bg-white/10 flex items-center justify-center shadow-sm active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-gray-400 text-xl font-bold">close</span>
          </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-32 flex flex-col gap-8 items-center">
          
          {/* ZPD ID CARD - HIGH FIDELITY */}
          <div className={`relative w-full max-w-[340px] aspect-[1.7] rounded-[3.5rem] overflow-hidden shadow-2xl border-[3px] border-blue-400/40 bg-white/60 dark:bg-white/5 backdrop-blur-3xl transition-all duration-1000 transform ${showId ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] select-none"><span className="text-[150px] font-black uppercase rotate-[-20deg] tracking-tighter">IDEN</span></div>
              <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-gradient-to-b from-transparent via-blue-400 to-transparent h-24 animate-scan-line"></div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-600 shadow-[0_-4px_10px_rgba(37,99,235,0.4)]"></div>

              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                          <div className="size-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                              <span className="material-symbols-outlined text-white text-2xl filled">shield</span>
                          </div>
                          <div>
                              <h3 className="text-[14px] font-black uppercase tracking-tight leading-none text-zpd-navy dark:text-white">ZOOTOPIA</h3>
                              <p className="text-[6px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Police Department</p>
                          </div>
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">RANK 5</div>
                  </div>

                  <div className="flex items-center gap-6 mt-auto">
                      <div className="size-24 rounded-2xl overflow-hidden border-2 border-white/60 shadow-xl bg-gray-100 shrink-0">
                          <img src={activeCharacter.image} className="w-full h-full object-cover object-top grayscale contrast-125 brightness-110" alt="Cadet" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-[7px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Assigned Cadet</p>
                          <h2 className="text-[22px] font-black text-zpd-navy dark:text-white uppercase leading-none tracking-tighter truncate italic mb-2">{displayName}</h2>
                          <div className="flex gap-4">
                              <div className="flex flex-col"><span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Age</span><span className="text-[10px] font-black">{ageLabel} YRS</span></div>
                              <div className="flex flex-col"><span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Gender</span><span className="text-[10px] font-black">{genderLabel}</span></div>
                              <div className="flex flex-col"><span className="text-[6px] font-black text-gray-400 uppercase tracking-widest">Partner</span><span className="text-[10px] font-black text-blue-600">{partnerName}</span></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* PHYSICAL ANALYSIS dashboard */}
          <div className="w-full max-w-[360px] bg-transparent rounded-[3.5rem] border-2 border-dashed border-zpd-gold p-10 relative flex flex-col items-center shadow-inner shadow-zpd-gold/10">
              <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.5em] mb-12">PHYSICAL ANALYSIS</h3>
              <div className="flex justify-between w-full items-end gap-3 px-2">
                  <AnalysisItem label="Height" value={userStats.height} />
                  <AnalysisItem label="Weight" value={userStats.weight} />
                  <AnalysisItem label="BMI" value={bmiValue} />
              </div>
              <button onClick={() => onNavigate(Screen.BIOMETRICS)} className="absolute bottom-6 right-10 text-zpd-gold hover:scale-110 transition-transform active:scale-95"><span className="material-symbols-outlined text-2xl">edit_note</span></button>
          </div>

          <div className="w-full mt-2">
            <div className="flex items-center gap-3 px-2 mb-8">
                <span className="size-2.5 rounded-full bg-zpd-gold shadow-[0_0_10px_rgba(250,204,21,0.6)]"></span>
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">FIELD COMMENDATIONS</h3>
            </div>
            <div className="flex justify-between items-center px-4">
                <Badge icon="military_tech" name="ROOKIE" earned={true} />
                <Badge icon="bolt" name="FAST" earned={true} />
                <Badge icon="diamond" name="ELITE" earned={false} />
                <Badge icon="local_police" name="HERO" earned={false} />
            </div>
          </div>
      </div>
    </div>
  );
};

const AnalysisItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex flex-col items-center flex-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</span>
        <div className="w-full border-b-2 border-dashed border-gray-300 dark:border-gray-800 text-center pb-3">
            <span className="text-3xl font-black text-zpd-navy dark:text-white tracking-tighter">{value}</span>
        </div>
    </div>
);

const Badge: React.FC<{ icon: string; name: string; earned: boolean }> = ({ icon, name, earned }) => (
    <div className="flex flex-col items-center gap-3 shrink-0">
        <div className={`size-18 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${earned ? 'bg-yellow-100 border-white shadow-xl scale-110 text-zpd-gold' : 'bg-gray-200 opacity-30 grayscale'}`}>
            <span className="material-symbols-outlined text-3xl filled">{icon}</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-colors mt-2 ${earned ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{name}</span>
    </div>
);

export default Profile;
