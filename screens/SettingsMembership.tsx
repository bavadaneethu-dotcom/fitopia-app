
import React from 'react';
import { Screen } from '../types';

interface SettingsMembershipProps {
  onNavigate: (screen: Screen) => void;
}

const SettingsMembership: React.FC<SettingsMembershipProps> = ({ onNavigate }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <button 
          onClick={() => onNavigate(Screen.SETTINGS)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">arrow_back</span>
        </button>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight">Membership</h2>
        <div className="size-12"></div>
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
          
          {/* Gold Card */}
          <div className="w-full aspect-[1.6] rounded-[2rem] bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-2xl relative overflow-hidden group transform hover:scale-105 transition-transform duration-500 mb-8">
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] animate-shine"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              
              <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-3xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <span className="text-white font-black text-xl uppercase tracking-widest">Pro Active</span>
              </div>

              <div className="absolute bottom-6 left-6">
                  <p className="text-white/80 text-xs font-bold uppercase tracking-wide mb-1">Member Since</p>
                  <p className="text-white font-mono font-bold text-lg">OCT 2024</p>
              </div>

              <div className="absolute bottom-6 right-6">
                  <span className="material-symbols-outlined text-white text-4xl opacity-50">fingerprint</span>
              </div>
          </div>

          <div className="w-full space-y-4">
              <h3 className="text-sm font-black text-light-text dark:text-white uppercase tracking-widest mb-2 pl-2">Active Benefits</h3>
              
              {[
                  { icon: 'lock_open', label: 'All Characters Unlocked' },
                  { icon: 'analytics', label: 'Advanced Analytics' },
                  { icon: 'cloud_off', label: 'Offline Mode' },
                  { icon: 'palette', label: 'Exclusive Themes' },
              ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-primary/10 dark:border-dark-primary/10 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="size-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                          <span className="material-symbols-outlined text-xl">{benefit.icon}</span>
                      </div>
                      <span className="font-bold text-light-text dark:text-white text-sm">{benefit.label}</span>
                      <span className="material-symbols-outlined text-green-500 ml-auto">check_circle</span>
                  </div>
              ))}
          </div>

          <div className="mt-auto pb-10 w-full text-center">
              <button className="text-xs font-bold text-red-500 uppercase tracking-wide hover:underline">Cancel Subscription</button>
          </div>
      </div>
      
      <style>{`
        @keyframes shine {
            0% { transform: translateX(-200%) skewX(-12deg); }
            20%, 100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
            animation: shine 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsMembership;
