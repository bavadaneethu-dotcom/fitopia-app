
import React, { useState } from 'react';
import { Character, Screen } from '../types';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeCharacter: Character;
  onNavigate: (screen: Screen) => void;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme, activeCharacter, onNavigate }) => {
  // Local state for toggles
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 pb-10 animate-fade-in">
      
      {/* Profile Level Card */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-[1.5rem] p-4 border border-yellow-200 dark:border-yellow-700 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative size-16 shrink-0">
            <div 
              className="size-16 rounded-full bg-cover bg-center border-2 border-yellow-400" 
              style={{ backgroundImage: `url("${activeCharacter.image}")` }}
            ></div>
            {activeCharacter.accessory && activeCharacter.accessory !== 'none' && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-1 border-2 border-yellow-50 shadow-sm">
                <span className="material-symbols-outlined text-[12px] font-bold block">style</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-black text-gray-900 dark:text-yellow-100 leading-none">{activeCharacter.name}</h3>
              <button 
                onClick={() => onNavigate(Screen.WARDROBE)}
                className="bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-xs font-bold px-3 py-1 rounded-full text-gray-700 dark:text-yellow-200 shadow-sm transition-all"
              >
                Edit
              </button>
            </div>
            <p className="text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-2">Level {activeCharacter.level} Rookie</p>
            <div className="w-full h-1.5 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full" 
                style={{ width: `${(activeCharacter.xp / activeCharacter.maxXp) * 100}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-yellow-700 dark:text-yellow-300 text-right mt-1 font-bold">{activeCharacter.maxXp - activeCharacter.xp} XP to Level {activeCharacter.level + 1}</p>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="App Preferences" />
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
          <SettingsItem 
            icon="dark_mode" 
            label="Theme" 
            value={isDarkMode ? "Dark" : "Light"}
            onClick={toggleTheme}
            hasToggle={true}
            isToggled={isDarkMode}
          />
          <SettingsItem icon="straighten" label="Units" value="Metric (kg, cm)" onClick={() => onNavigate(Screen.SETTINGS_UNITS)} />
          <SettingsItem 
            icon="notifications" 
            label="Notifications" 
            value={notifications ? "On" : "Off"} 
            hasToggle={true} 
            isToggled={notifications} 
            onClick={() => setNotifications(!notifications)}
          />
        </div>
      </div>

      {/* Gameplay */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Gameplay" />
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
          <SettingsItem icon="pets" label="Companion" value={activeCharacter.name} onClick={() => onNavigate(Screen.COMPANIONS)} />
          <SettingsItem 
            icon="music_note" 
            label="Sound Effects" 
            value={soundEffects ? "On" : "Off"} 
            hasToggle={true} 
            isToggled={soundEffects} 
            onClick={() => setSoundEffects(!soundEffects)}
          />
          <SettingsItem icon="animation" label="Animation Quality" value="High" onClick={() => onNavigate(Screen.SETTINGS_ANIMATION)} />
        </div>
      </div>

      {/* Account */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Account" />
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
          <SettingsItem icon="link" label="Connected Apps" value="Google Fit" onClick={() => onNavigate(Screen.SETTINGS_APPS)} />
          <SettingsItem icon="workspace_premium" label="Membership" value="Pro Active" iconColor="text-yellow-500" onClick={() => onNavigate(Screen.SETTINGS_MEMBERSHIP)} />
          <SettingsItem icon="logout" label="Log Out" isDestructive={true} onClick={() => onNavigate(Screen.LOGIN)} />
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-light-muted dark:text-dark-muted font-bold">Fitopia v1.0.4 (Build 2024)</p>
        <p className="text-[10px] text-light-muted/70 dark:text-dark-muted/70 mt-1">Made in Zootopia 🦊🐰</p>
      </div>

    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-[10px] font-black text-light-muted dark:text-dark-muted uppercase tracking-widest px-2">{title}</h4>
);

const SettingsItem: React.FC<{ icon: string; label: string; value?: string; onClick?: () => void; hasToggle?: boolean; isToggled?: boolean; iconColor?: string; isDestructive?: boolean }> = ({ 
  icon, label, value, onClick, hasToggle, isToggled, iconColor, isDestructive 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-light-bg dark:border-dark-bg last:border-0 group active:bg-black/10 dark:active:bg-white/10`}
    >
      <div className="flex items-center gap-3">
        <div className={`size-8 rounded-lg ${isDestructive ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-light-bg dark:bg-dark-bg'} flex items-center justify-center ${!isDestructive && (iconColor || 'text-light-text dark:text-dark-text')}`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <span className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-light-text dark:text-dark-text'}`}>{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-light-muted dark:text-dark-muted font-bold opacity-80">{value}</span>}
        {hasToggle ? (
          <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isToggled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${isToggled ? 'left-5' : 'left-1'}`}></div>
          </div>
        ) : (
          !isDestructive && <span className="material-symbols-outlined text-light-muted dark:text-dark-muted text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
        )}
      </div>
    </button>
  );
};

export default Settings;
