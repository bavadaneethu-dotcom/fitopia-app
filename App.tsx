
import React, { useState, useEffect } from 'react';
import { Screen, Character, ActivityLog, FoodLogItem } from './types';
import Home from './screens/Home';
import Analytics from './screens/Analytics';
import Achievements from './screens/Achievements';
import Settings from './screens/Settings';
import Companions from './screens/Companions';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Signup from './screens/Signup';
import CharacterSelect from './screens/CharacterSelect';
import UserData from './screens/UserData';
import GoalSelection from './screens/GoalSelection';
import FastingSetup from './screens/FastingSetup';
import PlanGeneration from './screens/PlanGeneration';
import FoodLog from './screens/FoodLog';
import WaterLog from './screens/WaterLog';
import MeditationTimer from './screens/MeditationTimer';
import WorkoutTimer from './screens/WorkoutTimer';
import ManualMeditationEntry from './screens/ManualMeditationEntry';
import ManualWorkoutEntry from './screens/ManualWorkoutEntry';
import WorkoutHistory from './screens/WorkoutHistory';
import MindfulnessHistory from './screens/MindfulnessHistory';
import ClaimReward from './screens/ClaimReward';
import Wardrobe from './screens/Wardrobe';
import SettingsUnits from './screens/SettingsUnits';
import SettingsAnimation from './screens/SettingsAnimation';
import SettingsApps from './screens/SettingsApps';
import SettingsMembership from './screens/SettingsMembership';
import FastingTimer from './screens/FastingTimer';

// Mock Data
export const CHARACTERS: Character[] = [
  {
    id: 'judy',
    name: 'Judy Hopps',
    role: 'Agility & Cardio',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Judy_Hopps.png',
    themeColor: 'blue',
    quotes: [
      "Ready to make the world a better place? Start with a squat!",
      "It's called a hustle, sweetheart. Now move your feet!",
      "I didn't move to Zootopia to skip leg day."
    ],
    onboardingMessages: {
      select: "Ready to make the world a better place? Let's start with your health!",
      dataSetup: "I need your stats for the ZPD files. Accuracy matters when we're chasing bad guys!",
      goal: "What's the mission? Speed? Strength? I'm ready for anything!",
      fasting: "Time management is key in traffic duty. Let's set a eating schedule that works.",
      plan: "Here is your training assignment. Let's hustle, sweetheart!"
    },
    level: 5,
    xp: 1250,
    maxXp: 1500,
    accessory: 'none'
  },
  {
    id: 'nick',
    name: 'Nick Wilde',
    role: 'Strategy & HIIT',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Nick_Wilde.png',
    themeColor: 'green',
    quotes: [
      "Never let them see that they get to you.",
      "It's called a rest set, sweetheart. Use it wisely."
    ],
    onboardingMessages: {
      select: "Stick with me, kid. I know all the shortcuts to getting fit.",
      dataSetup: "Details, details. Just fill 'em out so we can get to the fun part.",
      goal: "So, what's the angle? Looking good or feeling good? I can help with both.",
      fasting: "I know a guy who fasts. Works wonders. Pick a window, don't starve yourself.",
      plan: "I pulled some strings. Here's a plan that barely feels like work."
    },
    level: 3,
    xp: 800,
    maxXp: 1500,
    accessory: 'none'
  },
  {
    id: 'bogo',
    name: 'Chief Bogo',
    role: 'Strength & Power',
    image: 'https://static.wikia.nocookie.net/disney/images/9/91/Chief_Bogo_infobox.png',
    themeColor: 'gray',
    quotes: [
      "Life isn't some cartoon musical where you sing a little song and abs appear. WORK!",
      "Dismissed! ...Wait, you haven't finished your set."
    ],
    onboardingMessages: {
      select: "Do you think I got these horns by sitting on the couch? Join my squad.",
      dataSetup: "Report your metrics! Do not waste my time with guesses.",
      goal: "What is your objective? Make it count, or go home!",
      fasting: "Discipline! That is what this is about. Set your timer.",
      plan: "This is your briefing. Execute it perfectly. Dismissed!"
    },
    level: 10,
    xp: 200,
    maxXp: 3000,
    accessory: 'none'
  },
  {
    id: 'flash',
    name: 'Flash',
    role: 'Endurance & Yoga',
    image: 'https://static.wikia.nocookie.net/disney/images/9/9c/Flash_infobox.png',
    themeColor: 'brown',
    quotes: [
      "Standard... transaction... takes... effort...",
      "Nice... hustle... buddy..."
    ],
    onboardingMessages: {
      select: "I... can... help... you... go... the... distance...",
      dataSetup: "Whaaat... is... yooour... naaame...?",
      goal: "Slooow... and... steaaady... wins... the... raaace...",
      fasting: "Areee... yooou... hunnnngrrry...?",
      plan: "Heeeere... is... yooour... plaaan... buddy..."
    },
    level: 2,
    xp: 100,
    maxXp: 1000,
    accessory: 'none'
  },
  {
    id: 'finnick',
    name: 'Finnick',
    role: 'Speed & Agility',
    image: 'https://static.wikia.nocookie.net/disney/images/2/2f/Finnick_infobox.png',
    themeColor: 'orange',
    quotes: [
      "I'm all grit, no quit. And I bite ankles.",
      "You call that a sprint? My grandma moves faster."
    ],
    onboardingMessages: {
      select: "You want the cute one? Too bad. I'm gonna work you hard.",
      dataSetup: "You tall or what? Fill this out, I ain't got all day.",
      goal: "You wanna get big? Or just fast? Let's get moving.",
      fasting: "Starving? Good. Makes you meaner. Pick a time.",
      plan: "Here. Don't cry about it. Now go lift something."
    },
    level: 7,
    xp: 400,
    maxXp: 2000,
    accessory: 'none'
  }
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<Character>(CHARACTERS[0]);
  
  // Fasting State (Lifted)
  const [isFasting, setIsFasting] = useState(false);
  const [fastStartTime, setFastStartTime] = useState<Date | null>(null);

  // State to pass data to session timers
  const [activeSession, setActiveSession] = useState<{ title: string; icon: string; duration?: string; color?: string } | null>(null);

  // State for Navigation Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // History Logs
  const [workoutLogs, setWorkoutLogs] = useState<ActivityLog[]>([]);
  const [meditationLogs, setMeditationLogs] = useState<ActivityLog[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([]);

  // Inventory State
  const [inventory, setInventory] = useState<string[]>(['none']); // 'none' is always owned

  // Initialize theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Helper to start a session and navigate
  const startSession = (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => {
    setActiveSession(data);
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const handleSessionComplete = (type: 'workout' | 'meditation', data: any) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: data.title,
      icon: data.icon,
      duration: data.duration, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      calories: data.calories,
      color: data.color
    };

    if (type === 'workout') {
      setWorkoutLogs(prev => [newLog, ...prev]);
    } else {
      setMeditationLogs(prev => [newLog, ...prev]);
    }
    setCurrentScreen(Screen.HOME);
  };

  const handleAddFood = (item: FoodLogItem) => {
    setFoodLogs(prev => [item, ...prev]);
  };

  const handleUnlockItem = (itemId: string) => {
    if (!inventory.includes(itemId)) {
      setInventory(prev => [...prev, itemId]);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.WELCOME:
        return <Welcome onNavigate={handleNavigate} />;
      case Screen.LOGIN:
        return <Login onNavigate={handleNavigate} />;
      case Screen.SIGNUP:
        return <Signup onNavigate={handleNavigate} />;
      case Screen.CHARACTER_SELECT:
        return <CharacterSelect activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} onNavigate={handleNavigate} />;
      case Screen.USER_DATA:
        return <UserData activeCharacter={activeCharacter} onNavigate={handleNavigate} />;
      case Screen.GOAL_SELECTION:
        return <GoalSelection activeCharacter={activeCharacter} onNavigate={handleNavigate} />;
      case Screen.FASTING_SETUP:
        return <FastingSetup activeCharacter={activeCharacter} onNavigate={handleNavigate} />;
      case Screen.PLAN_GENERATION:
        return <PlanGeneration activeCharacter={activeCharacter} onNavigate={handleNavigate} />;
      case Screen.HOME:
        return <Home 
            character={activeCharacter} 
            onNavigate={handleNavigate} 
            onStartSession={startSession} 
            workoutLogs={workoutLogs}
            meditationLogs={meditationLogs}
            isFasting={isFasting}
            fastStartTime={fastStartTime}
        />;
      case Screen.FASTING_TIMER:
        return <FastingTimer 
            onNavigate={handleNavigate} 
            isFasting={isFasting} 
            setIsFasting={setIsFasting}
            fastStartTime={fastStartTime}
            setFastStartTime={setFastStartTime}
        />;
      case Screen.FOOD_LOG:
        return <FoodLog 
            onNavigate={handleNavigate} 
            activeCharacter={activeCharacter} 
            onAddFood={handleAddFood}
            foodLogs={foodLogs}
        />;
      case Screen.WATER_LOG:
        return <WaterLog onNavigate={handleNavigate} />;
      case Screen.ANALYTICS:
        return <Analytics 
            foodLogs={foodLogs}
            workoutLogs={workoutLogs}
            meditationLogs={meditationLogs}
            onNavigate={handleNavigate}
        />;
      case Screen.WORKOUT_HISTORY:
        return <WorkoutHistory logs={workoutLogs} onNavigate={handleNavigate} />;
      case Screen.MINDFULNESS_HISTORY:
        return <MindfulnessHistory logs={meditationLogs} onNavigate={handleNavigate} />;
      case Screen.ACHIEVEMENTS:
        return <Achievements onNavigate={handleNavigate} inventory={inventory} />;
      case Screen.CLAIM_REWARD:
        return <ClaimReward activeCharacter={activeCharacter} onNavigate={handleNavigate} onUnlock={handleUnlockItem} />;
      case Screen.WARDROBE:
        return <Wardrobe activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} inventory={inventory} onNavigate={handleNavigate} />;
      case Screen.SETTINGS:
        return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} activeCharacter={activeCharacter} onNavigate={handleNavigate} />;
      case Screen.SETTINGS_UNITS:
        return <SettingsUnits onNavigate={handleNavigate} />;
      case Screen.SETTINGS_ANIMATION:
        return <SettingsAnimation onNavigate={handleNavigate} />;
      case Screen.SETTINGS_APPS:
        return <SettingsApps onNavigate={handleNavigate} />;
      case Screen.SETTINGS_MEMBERSHIP:
        return <SettingsMembership onNavigate={handleNavigate} />;
      case Screen.COMPANIONS:
        return <Companions activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.MEDITATION_TIMER:
        return <MeditationTimer 
            onNavigate={handleNavigate} 
            sessionData={activeSession} 
            onComplete={(data) => handleSessionComplete('meditation', data)}
        />;
      case Screen.WORKOUT_TIMER:
        return <WorkoutTimer 
            onNavigate={handleNavigate} 
            sessionData={activeSession} 
            onComplete={(data) => handleSessionComplete('workout', data)}
        />;
      case Screen.MANUAL_MEDITATION:
        return <ManualMeditationEntry onNavigate={handleNavigate} onStartSession={startSession} />;
      case Screen.MANUAL_WORKOUT:
        return <ManualWorkoutEntry onNavigate={handleNavigate} onStartSession={startSession} />;
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  // Check if we should show the main app navigation and header
  const isMainApp = [Screen.HOME, Screen.ANALYTICS, Screen.ACHIEVEMENTS, Screen.SETTINGS, Screen.COMPANIONS].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-light-bg dark:bg-dark-bg shadow-2xl overflow-hidden relative transition-colors duration-300">
      
      {/* Header - Persistent (only in main app) */}
      {isMainApp && (
        <header className="flex items-center justify-between px-6 pt-12 pb-4 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md sticky top-0 border-b border-light-primary/10 dark:border-dark-primary/10">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setCurrentScreen(Screen.SETTINGS)}
              className="relative rounded-full size-11 overflow-hidden border-2 border-light-primary dark:border-dark-primary shadow-md hover:scale-105 transition-transform"
            >
              <img 
                src={activeCharacter.image}
                className="w-full h-full object-cover object-top" 
                alt="Profile"
              />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-black leading-none text-light-text dark:text-dark-text tracking-tight uppercase">
                {activeCharacter.name}
              </h1>
              <span className="text-light-muted dark:text-dark-muted text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 mt-0.5">
                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                On Duty
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-light-muted dark:text-dark-muted uppercase">Today</span>
                <span className="text-xs font-black text-light-text dark:text-white">Oct 24</span>
            </div>
            <div className="size-10 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-primary/20 dark:border-dark-primary/20 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-light-primary dark:text-dark-primary">calendar_month</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar relative z-10 ${isMainApp ? 'pb-28' : ''}`}>
        {renderScreen()}
      </main>

      {/* Expanded Action Menu */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-40">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in" 
             onClick={() => setIsMenuOpen(false)}
           ></div>
           
           {/* Menu Items */}
           <div className="absolute bottom-28 left-0 right-0 px-8 flex flex-col gap-3 items-center animate-fade-in-up z-50 pointer-events-none">
              <div className="w-full max-w-[280px] flex flex-col gap-3 pointer-events-auto">
                 <MenuOption 
                    label="Log Meal" 
                    icon="restaurant" 
                    color="bg-orange-500 text-white" 
                    onClick={() => handleNavigate(Screen.FOOD_LOG)} 
                    delay="0ms" 
                 />
                 <MenuOption 
                    label="Hydration" 
                    icon="water_drop" 
                    color="bg-blue-500 text-white" 
                    onClick={() => handleNavigate(Screen.WATER_LOG)} 
                    delay="50ms" 
                 />
                 <MenuOption 
                    label="Record Workout" 
                    icon="fitness_center" 
                    color="bg-red-500 text-white" 
                    onClick={() => handleNavigate(Screen.MANUAL_WORKOUT)} 
                    delay="100ms" 
                 />
                 <MenuOption 
                    label="Mindfulness" 
                    icon="self_improvement" 
                    color="bg-teal-500 text-white" 
                    onClick={() => handleNavigate(Screen.MANUAL_MEDITATION)} 
                    delay="150ms" 
                 />
              </div>
           </div>
        </div>
      )}

      {/* Bottom Navigation - Persistent (only in main app) */}
      {isMainApp && (
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 px-6 pb-6 pt-4 bg-gradient-to-t from-light-bg dark:from-dark-bg via-light-bg/95 dark:via-dark-bg/95 to-transparent pointer-events-none">
          <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border border-light-primary/20 dark:border-dark-primary/20 rounded-[2rem] h-20 flex justify-between items-center shadow-2xl shadow-black/10 pointer-events-auto px-2 relative">
            
            <NavItem 
              icon="home" 
              label="Home" 
              isActive={currentScreen === Screen.HOME} 
              onClick={() => handleNavigate(Screen.HOME)} 
            />
            <NavItem 
              icon="bar_chart" 
              label="Stats" 
              isActive={currentScreen === Screen.ANALYTICS} 
              onClick={() => handleNavigate(Screen.ANALYTICS)} 
            />
            
            {/* FAB Placeholder */}
            <div className="w-16"></div> 

            <NavItem 
              icon="emoji_events" 
              label="Rewards" 
              isActive={currentScreen === Screen.ACHIEVEMENTS} 
              onClick={() => handleNavigate(Screen.ACHIEVEMENTS)} 
            />
            <NavItem 
              icon="settings" 
              label="Settings" 
              isActive={currentScreen === Screen.SETTINGS} 
              onClick={() => handleNavigate(Screen.SETTINGS)} 
            />

            {/* Floating Action Button (FAB) - Centered & Elevated */}
            <button 
                onClick={toggleMenu}
                className={`absolute left-1/2 -translate-x-1/2 -top-6 size-16 bg-light-primary dark:bg-dark-primary rounded-full shadow-lg shadow-light-primary/40 dark:shadow-dark-primary/40 flex items-center justify-center text-white dark:text-dark-bg transition-all duration-300 hover:scale-110 active:scale-95 border-[6px] border-light-bg dark:border-dark-bg group z-50 ${isMenuOpen ? 'rotate-45 bg-red-500 dark:bg-red-500' : ''}`}
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>
        </nav>
      )}

    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 group ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
    >
      <div className={`size-10 rounded-xl flex items-center justify-center transition-colors mb-1 ${
        isActive 
          ? 'bg-light-primary/20 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary' 
          : 'bg-transparent text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/5'
      }`}>
        <span className={`material-symbols-outlined text-2xl ${isActive ? 'filled' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${
          isActive ? 'text-light-primary dark:text-dark-primary' : 'text-gray-400'
      }`}>{label}</span>
    </button>
  );
};

const MenuOption: React.FC<{ label: string; icon: string; color: string; onClick: () => void; delay: string }> = ({ label, icon, color, onClick, delay }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-white/10 shadow-lg transform transition-all hover:scale-105 active:scale-95`}
    style={{ animationDelay: delay }}
  >
    <span className="font-bold text-gray-800 dark:text-white uppercase tracking-wide text-xs pl-2">{label}</span>
    <div className={`size-9 rounded-full ${color} flex items-center justify-center shadow-md`}>
      <span className="material-symbols-outlined text-lg">{icon}</span>
    </div>
  </button>
);

export default App;
