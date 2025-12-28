
import React, { useState, useEffect } from 'react';
import { Character, Screen } from '../types';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  activeCharacter: Character;
  onNavigate: (screen: Screen) => void;
  unitSystem: 'metric' | 'imperial';
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme, activeCharacter, onNavigate, unitSystem }) => {
  const [soundEffects, setSoundEffects] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      setCanInstall(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    if (iOS) {
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      alert('To install:\n1. Tap the Share button\n2. Select "Add to Home Screen"\n3. Tap "Add"');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 pb-10 animate-fade-in relative">
      
      {/* Settings Page Header - Close button removed as this is a main tab */}
      <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Settings</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">System Parameters</span>
          </div>
      </div>

      {/* Profile Level Card */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-[2.5rem] p-6 border border-yellow-200 dark:border-yellow-700 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative size-16 shrink-0">
            <div 
              className="size-16 rounded-full bg-cover bg-center border-2 border-yellow-400 shadow-md" 
              style={{ backgroundImage: `url("${activeCharacter.image}")` }}
            ></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-black text-gray-900 dark:text-yellow-100 leading-none">{activeCharacter.name}</h3>
              <button 
                onClick={() => onNavigate(Screen.WARDROBE)}
                className="bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-gray-700 dark:text-yellow-200 shadow-sm transition-all"
              >
                Wardrobe
              </button>
            </div>
            <p className="text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-2">Level {activeCharacter.level} Officer</p>
            <div className="w-full h-1.5 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full" 
                style={{ width: `${(activeCharacter.xp / activeCharacter.maxXp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="App Preferences" />
        <div className="bg-light-surface dark:bg-dark-surface rounded-[2rem] overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
          <SettingsItem 
            icon="dark_mode" 
            label="Theme" 
            value={isDarkMode ? "Dark" : "Light"}
            onClick={toggleTheme}
            hasToggle={true}
            isToggled={isDarkMode}
          />
          <SettingsItem 
            icon="straighten" 
            label="Units" 
            value={unitSystem === 'metric' ? "Metric (kg, cm)" : "Imperial (lbs, ft)"} 
            onClick={() => onNavigate(Screen.SETTINGS_UNITS)} 
          />
          <SettingsItem 
            icon="notifications" 
            label="Notifications" 
            value="Configure"
            onClick={() => onNavigate(Screen.SETTINGS_NOTIFICATIONS)}
          />
          {canInstall && (
            <SettingsItem 
              icon="download" 
              label="Install App" 
              value={isIOS ? "iOS Instructions" : "Install Now"}
              onClick={handleInstall}
              iconColor="text-yellow-500"
            />
          )}
        </div>
      </div>

      {/* Gameplay */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Training Mode" />
        <div className="bg-light-surface dark:bg-dark-surface rounded-[2rem] overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
          <SettingsItem icon="pets" label="Partner" value={activeCharacter.name} onClick={() => onNavigate(Screen.COMPANIONS)} />
          <SettingsItem 
            icon="music_note" 
            label="ZPD Sounds" 
            value={soundEffects ? "Active" : "Silent"} 
            hasToggle={true} 
            isToggled={soundEffects} 
            onClick={() => setSoundEffects(!soundEffects)}
          />
        </div>
      </div>

      {/* Account */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Academy Account" />
        <div className="bg-light-surface dark:bg-dark-surface rounded-[2rem] overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
          <SettingsItem icon="link" label="Integrations" value="Google Fit" onClick={() => onNavigate(Screen.SETTINGS_APPS)} />
          <SettingsItem icon="workspace_premium" label="Rank" value="Pro Active" iconColor="text-yellow-500" onClick={() => onNavigate(Screen.SETTINGS_MEMBERSHIP)} />
          <SettingsItem icon="logout" label="Sign Out" isDestructive={true} onClick={() => onNavigate(Screen.LOGIN)} />
        </div>
      </div>

      <div className="text-center mt-6 pb-6">
        <p className="text-[10px] text-light-muted dark:text-dark-muted font-black uppercase tracking-[0.2em] opacity-50">Fitopia ZPD Unit v1.0.8</p>
      </div>

    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-[10px] font-black text-light-muted dark:text-dark-muted uppercase tracking-widest px-4 mb-1">{title}</h4>
);

const SettingsItem: React.FC<{ icon: string; label: string; value?: string; onClick?: () => void; hasToggle?: boolean; isToggled?: boolean; iconColor?: string; isDestructive?: boolean }> = ({ 
  icon, label, value, onClick, hasToggle, isToggled, iconColor, isDestructive 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-light-bg dark:border-dark-bg last:border-0 group active:bg-black/10 dark:active:bg-white/10`}
    >
      <div className="flex items-center gap-3">
        <div className={`size-9 rounded-xl ${isDestructive ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-light-bg dark:bg-dark-bg shadow-inner'} flex items-center justify-center ${!isDestructive && (iconColor || 'text-light-text dark:text-dark-text')}`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <span className={`text-sm font-black uppercase tracking-tight ${isDestructive ? 'text-red-500' : 'text-light-text dark:text-dark-text'}`}>{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {value && <span className="text-[10px] text-light-muted dark:text-dark-muted font-bold uppercase tracking-widest opacity-60">{value}</span>}
        {hasToggle ? (
          <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isToggled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${isToggled ? 'left-6' : 'left-1'}`}></div>
          </div>
        ) : (
          !isDestructive && <span className="material-symbols-outlined text-light-muted dark:text-dark-muted text-xl group-hover:translate-x-1 transition-transform">chevron_right</span>
        )}
      </div>
    </button>
  );
};

export default Settings;
