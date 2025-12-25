
import React, { useState } from 'react';
import { Screen } from '../types';

interface SettingsNotificationsProps {
  onNavigate: (screen: Screen) => void;
}

interface AlertConfig {
  id: string;
  label: string;
  description: string;
  iconUrl: string;
  soundName: string;
  soundIcon: string; // Material symbol for the sound type
  enabled: boolean;
}

const AVAILABLE_SOUNDS = [
    { name: 'Dinner Bell', icon: 'notifications_active' },
    { name: 'Splash', icon: 'water_drop' },
    { name: 'Soft Gong', icon: 'album' },
    { name: 'Zen Chime', icon: 'spa' },
    { name: 'Whistle', icon: 'sports' },
    { name: 'Success', icon: 'check_circle' },
    { name: 'Pop', icon: 'bubble_chart' },
    { name: 'Ding', icon: 'notifications' },
    { name: 'Siren', icon: 'emergency' },
    { name: 'Roar', icon: 'pets' },
];

const SettingsNotifications: React.FC<SettingsNotificationsProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([
    { 
      id: 'food', 
      label: 'Food Alert', 
      description: 'Meal reminders', 
      iconUrl: 'https://img.icons8.com/fluency/96/hamburger.png', 
      soundName: 'Dinner Bell', 
      soundIcon: 'notifications_active',
      enabled: true,
    },
    { 
      id: 'water', 
      label: 'Water Alert', 
      description: 'Hydration checks', 
      iconUrl: 'https://img.icons8.com/fluency/96/water.png', 
      soundName: 'Splash', 
      soundIcon: 'water_drop',
      enabled: true,
    },
    { 
      id: 'fasting', 
      label: 'Fasting Alert', 
      description: 'Window start/end', 
      iconUrl: 'https://img.icons8.com/fluency/96/clock.png', 
      soundName: 'Soft Gong', 
      soundIcon: 'album',
      enabled: true,
    },
    { 
      id: 'meditation', 
      label: 'Meditation Alert', 
      description: 'Mindfulness cues', 
      iconUrl: 'https://img.icons8.com/fluency/96/lotus.png', 
      soundName: 'Zen Chime', 
      soundIcon: 'spa',
      enabled: false,
    },
    { 
      id: 'activity', 
      label: 'Activity Alert', 
      description: 'Workout nudge', 
      iconUrl: 'https://img.icons8.com/fluency/96/dumbbell.png', 
      soundName: 'Siren', 
      soundIcon: 'emergency',
      enabled: true,
    },
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    weeklyReport: true,
    newChallenges: true,
    systemUpdates: false
  });

  const [activeSoundSelectId, setActiveSoundSelectId] = useState<string | null>(null);

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const updateSound = (soundName: string, soundIcon: string) => {
      if (activeSoundSelectId) {
          setAlerts(prev => prev.map(alert => 
              alert.id === activeSoundSelectId ? { ...alert, soundName, soundIcon } : alert
          ));
          setActiveSoundSelectId(null);
      }
  };

  const toggleGeneral = (key: keyof typeof generalSettings) => {
    setGeneralSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-2 justify-between z-20 sticky top-0 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <div className="size-12"></div>
        <h2 className="text-lg font-black leading-tight text-light-text dark:text-white uppercase tracking-tight">Notifications</h2>
        <button 
          onClick={() => onNavigate(Screen.SETTINGS)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-light-text dark:text-white text-2xl">close</span>
        </button>
      </div>

      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-10">
          <p className="text-light-muted dark:text-dark-muted text-sm font-medium text-center mb-2">
              Customize your ZPD alert sounds and frequencies.
          </p>

          <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
              {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border-b border-light-bg dark:border-dark-bg last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 flex-1 pr-2" onClick={() => toggleAlert(alert.id)}>
                        <div className={`size-12 shrink-0 transition-opacity ${alert.enabled ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                            <img src={alert.iconUrl} alt={alert.label} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-light-text dark:text-white leading-tight truncate">{alert.label}</h3>
                            <p className="text-[10px] font-medium text-light-muted dark:text-dark-muted mt-0.5 leading-snug opacity-80">{alert.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sound Indicator Chip (Clickable) */}
                        <button 
                            onClick={() => setActiveSoundSelectId(alert.id)}
                            disabled={!alert.enabled}
                            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${alert.enabled ? 'border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 hover:border-light-primary/50' : 'border-transparent opacity-0 pointer-events-none'}`}
                        >
                            <span className={`material-symbols-outlined text-[16px] text-light-primary dark:text-dark-primary`}>{alert.soundIcon}</span>
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{alert.soundName}</span>
                            <span className="material-symbols-outlined text-[14px] text-gray-400">expand_more</span>
                        </button>

                        {/* Mobile Sound Icon Only */}
                        <button 
                            onClick={() => setActiveSoundSelectId(alert.id)}
                            disabled={!alert.enabled}
                            className={`sm:hidden size-8 flex items-center justify-center rounded-full transition-all active:scale-95 ${alert.enabled ? 'bg-gray-100 dark:bg-white/10 text-light-primary dark:text-dark-primary' : 'opacity-0 pointer-events-none'}`}
                        >
                             <span className={`material-symbols-outlined text-[18px]`}>{alert.soundIcon}</span>
                        </button>

                        {/* Toggle */}
                        <div 
                            onClick={() => toggleAlert(alert.id)}
                            className={`w-11 h-6 rounded-full relative transition-colors duration-300 shrink-0 cursor-pointer ${alert.enabled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                            <div className={`absolute top-1 size-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${alert.enabled ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
              ))}
          </div>

          <h3 className="text-xs font-black text-light-muted dark:text-dark-muted uppercase tracking-widest px-2 mt-2">System</h3>
          
          <div className="bg-light-surface dark:bg-dark-surface rounded-2xl overflow-hidden border border-light-primary/10 dark:border-dark-primary/10">
              <NotificationToggle 
                label="Weekly Report" 
                description="Summary of your weekly progress and stats."
                icon="analytics"
                isOn={generalSettings.weeklyReport} 
                onToggle={() => toggleGeneral('weeklyReport')} 
              />
              <NotificationToggle 
                label="New Challenges" 
                description="Alerts when new ZPD missions are available."
                icon="emoji_events"
                isOn={generalSettings.newChallenges} 
                onToggle={() => toggleGeneral('newChallenges')} 
              />
              <NotificationToggle 
                label="System Updates" 
                description="News about app features and maintenance."
                icon="system_update"
                isOn={generalSettings.systemUpdates} 
                onToggle={() => toggleGeneral('systemUpdates')} 
              />
          </div>
      </div>

      {/* Sound Selection Modal */}
      {activeSoundSelectId && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveSoundSelectId(null)}>
              <div 
                className="bg-white dark:bg-[#1a1a1a] w-full max-w-sm rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-slide-up sm:animate-pop-in max-h-[70vh] flex flex-col" 
                onClick={(e) => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">Choose Sound</h3>
                      <button onClick={() => setActiveSoundSelectId(null)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 overflow-y-auto no-scrollbar">
                      {AVAILABLE_SOUNDS.map((sound) => {
                          const currentAlert = alerts.find(a => a.id === activeSoundSelectId);
                          const isSelected = currentAlert?.soundName === sound.name;
                          return (
                              <button 
                                key={sound.name}
                                onClick={() => updateSound(sound.name, sound.icon)}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all active:scale-[0.98] ${isSelected ? 'bg-light-primary/10 dark:bg-dark-primary/10 border-2 border-light-primary dark:border-dark-primary' : 'bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'}`}
                              >
                                  <div className={`size-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-light-primary dark:bg-dark-primary text-white dark:text-dark-bg' : 'bg-white dark:bg-white/10 text-gray-400'}`}>
                                      <span className="material-symbols-outlined text-lg">{sound.icon}</span>
                                  </div>
                                  <span className={`text-sm font-bold flex-1 text-left ${isSelected ? 'text-light-primary dark:text-dark-primary' : 'text-gray-700 dark:text-gray-300'}`}>{sound.name}</span>
                                  {isSelected && <span className="material-symbols-outlined text-light-primary dark:text-dark-primary">check_circle</span>}
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

const NotificationToggle: React.FC<{ label: string; description: string; icon: string; isOn: boolean; onToggle: () => void }> = ({ label, description, icon, isOn, onToggle }) => (
    <div className="flex items-center justify-between p-4 border-b border-light-bg dark:border-dark-bg last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3 flex-1 pr-4">
            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${isOn ? 'bg-light-primary/20 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <div>
                <h3 className="text-sm font-bold text-light-text dark:text-white leading-tight">{label}</h3>
                <p className="text-[10px] font-medium text-light-muted dark:text-dark-muted mt-0.5 leading-snug opacity-80">{description}</p>
            </div>
        </div>
        <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${isOn ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`absolute top-1 size-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${isOn ? 'left-6' : 'left-1'}`}></div>
        </div>
    </div>
);

export default SettingsNotifications;
