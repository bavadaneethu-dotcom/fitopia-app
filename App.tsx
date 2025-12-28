
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Screen, Character, ActivityLog, FoodLogItem, WaterLogItem, UserStats, FastingPlanConfig, FastingLog } from './types';
import Home from './screens/Home';
import Analytics from './screens/Analytics';
import Achievements from './screens/Achievements';
import Settings from './screens/Settings';
import Companions from './screens/Companions';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ForgotPassword from './screens/ForgotPassword';
import CharacterSelect from './screens/CharacterSelect';
import UserData from './screens/UserData';
import GoalSelection from './screens/GoalSelection';
import FastingSetup from './screens/FastingSetup';
import PlanGeneration from './screens/PlanGeneration';
import FoodLog from './screens/FoodLog';
import FoodHistory from './screens/FoodHistory';
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
import SettingsNotifications from './screens/SettingsNotifications';
import SettingsApps from './screens/SettingsApps';
import SettingsMembership from './screens/SettingsMembership';
import FastingTimer from './screens/FastingTimer';
import Biometrics from './screens/Biometrics';
import Profile from './screens/Profile';

// Mock Data
export const CHARACTERS: Character[] = [
  {
    id: 'judy',
    name: 'Judy Hopps',
    role: 'Agility & Cardio',
    image: 'https://static.wikia.nocookie.net/zootopia/images/a/aa/Judy_Hopps_Render.png',
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
    image: 'https://static.wikia.nocookie.net/zootopia/images/0/03/Nick_Wilde_Render.png',
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
    image: 'https://static.wikia.nocookie.net/zootopia/images/e/e5/Chief_Bogo_Render.png',
    themeColor: 'gray',
    quotes: [
      "Life isn't some cartoon musical where you sing a little song and abs appear. WORK!",
      "Dismissed! ...Wait, you haven't finished your set."
    ],
    onboardingMessages: {
      select: "Do you think I got these horns by sitting on the base? Join my squad.",
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
    image: 'https://static.wikia.nocookie.net/zootopia/images/a/a2/Flash_Render.png',
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
    image: 'https://static.wikia.nocookie.net/zootopia/images/5/5a/Finnick_Render.png',
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

// Helper to format date YYYY-MM-DD
const formatDateKey = (date: Date) => {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<Character>(CHARACTERS[0]);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [dailyCalorieLimit, setDailyCalorieLimit] = useState<number>(2430);
  const [userGoal, setUserGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  
  // Date State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Overlay visibility control
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Fasting State
  const [isFasting, setIsFasting] = useState(false);
  const [fastStartTime, setFastStartTime] = useState<Date | null>(null);
  const [fastingPlan, setFastingPlan] = useState<FastingPlanConfig>({
    protocol: '16:8 Method',
    fastingHours: 16,
    eatingHours: 8
  });

  // User Data State
  const [userStats, setUserStats] = useState<UserStats>({
    name: '',
    dob: '',
    gender: 'male',
    age: '24',
    height: "5'10",
    weight: '165',
    activityLevel: 'Active'
  });

  const [activeSession, setActiveSession] = useState<{ title: string; icon: string; duration?: string; color?: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // History Logs
  const [workoutLogs, setWorkoutLogs] = useState<ActivityLog[]>([]);
  const [meditationLogs, setMeditationLogs] = useState<ActivityLog[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLogItem[]>([]);
  const [fastingLogs, setFastingLogs] = useState<FastingLog[]>([]);

  // Inventory State
  const [inventory, setInventory] = useState<string[]>(['none']);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleUpdateUnitSystem = (newSystem: 'metric' | 'imperial') => {
    if (newSystem !== unitSystem) {
      const newStats = { ...userStats };
      const weightVal = parseFloat(userStats.weight);
      if (!isNaN(weightVal)) {
          if (newSystem === 'imperial') {
              newStats.weight = Math.round(weightVal * 2.20462).toString();
          } else {
              newStats.weight = Math.round(weightVal / 2.20462).toString();
          }
      }
      setUserStats(newStats);
      setUnitSystem(newSystem);
    }
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const filteredWorkoutLogs = useMemo(() => workoutLogs.filter(log => log.date === selectedDateKey), [workoutLogs, selectedDateKey]);
  const filteredMeditationLogs = useMemo(() => meditationLogs.filter(log => log.date === selectedDateKey), [meditationLogs, selectedDateKey]);
  const filteredFoodLogs = useMemo(() => foodLogs.filter(log => log.date === selectedDateKey), [foodLogs, selectedDateKey]);
  const filteredWaterLogs = useMemo(() => waterLogs.filter(log => log.date === selectedDateKey), [waterLogs, selectedDateKey]);
  const filteredFastingLogs = useMemo(() => fastingLogs.filter(log => log.date === selectedDateKey), [fastingLogs, selectedDateKey]);

  const startSession = (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => {
    setActiveSession(data);
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
    setIsOverlayOpen(false); 
  };

  const handleUnlock = (itemId: string) => {
    if (!inventory.includes(itemId)) {
      setInventory(prev => [...prev, itemId]);
    }
  };

  const handleSessionComplete = (type: 'workout' | 'meditation', data: any) => {
    const today = new Date();
    const newLog: ActivityLog = {
      id: data.id || Date.now().toString(),
      title: data.title,
      icon: data.icon,
      duration: data.duration, 
      timestamp: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: formatDateKey(today),
      calories: data.calories,
      color: data.color
    };
    if (type === 'workout') {
      if (data.id) {
          setWorkoutLogs(prev => prev.map(x => x.id === data.id ? newLog : x));
      } else {
          setWorkoutLogs(prev => [newLog, ...prev]);
      }
    } else {
      if (data.id) {
          setMeditationLogs(prev => prev.map(x => x.id === data.id ? newLog : x));
      } else {
          setMeditationLogs(prev => [newLog, ...prev]);
      }
    }
    setSelectedDate(today);
    // REMOVED automatic navigation to HOME to allow user to see the updated log on the same page
  };

  const handleAddFood = (item: FoodLogItem) => {
    const today = new Date();
    const newItem = { ...item, date: formatDateKey(today) };
    setFoodLogs(prev => [newItem, ...prev]);
    setSelectedDate(today);
  };

  const handleAddWater = (amount: number) => {
    const today = new Date();
    const newItem: WaterLogItem = {
      id: Date.now().toString(),
      amount,
      timestamp: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: formatDateKey(today)
    };
    setWaterLogs(prev => [newItem, ...prev]);
    setSelectedDate(today);
  };

  const handleFastingStateChange = (fasting: boolean) => {
    if (!fasting && isFasting && fastStartTime) {
        const now = new Date();
        const diff = now.getTime() - fastStartTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const newLog: FastingLog = {
            id: Date.now().toString(),
            duration: `${hours}h ${mins}m`,
            startTime: fastStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: formatDateKey(now)
        };
        setFastingLogs(prev => [newLog, ...prev]);
    }
    setIsFasting(fasting);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.WELCOME: return <Welcome onNavigate={handleNavigate} />;
      case Screen.LOGIN: return <Login onNavigate={handleNavigate} />;
      case Screen.SIGNUP: return <Signup onNavigate={handleNavigate} />;
      case Screen.FORGOT_PASSWORD: return <ForgotPassword onNavigate={handleNavigate} />;
      case Screen.CHARACTER_SELECT: return <CharacterSelect activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} onNavigate={handleNavigate} />;
      case Screen.USER_DATA: return <UserData activeCharacter={activeCharacter} onNavigate={handleNavigate} userStats={userStats} setUserStats={setUserStats} />;
      case Screen.GOAL_SELECTION: return <GoalSelection activeCharacter={activeCharacter} onNavigate={handleNavigate} userGoal={userGoal} setUserGoal={setUserGoal} />;
      case Screen.FASTING_SETUP: return <FastingSetup activeCharacter={activeCharacter} onNavigate={handleNavigate} setFastingPlan={setFastingPlan} />;
      case Screen.PLAN_GENERATION: return <PlanGeneration activeCharacter={activeCharacter} onNavigate={handleNavigate} fastingPlan={fastingPlan} calories={dailyCalorieLimit} setCalories={setDailyCalorieLimit} userStats={userStats} userGoal={userGoal} />;
      case Screen.HOME: return <Home character={activeCharacter} onNavigate={handleNavigate} onStartSession={startSession} workoutLogs={filteredWorkoutLogs} meditationLogs={filteredMeditationLogs} foodLogs={filteredFoodLogs} waterLogs={filteredWaterLogs} isFasting={isFasting} fastStartTime={fastStartTime} unitSystem={unitSystem} dailyCalorieLimit={dailyCalorieLimit} />;
      case Screen.FASTING_TIMER: return <FastingTimer onNavigate={handleNavigate} isFasting={isFasting} setIsFasting={handleFastingStateChange} fastStartTime={fastStartTime} setFastStartTime={setFastStartTime} fastingPlan={fastingPlan} />;
      case Screen.FOOD_LOG: return <FoodLog onNavigate={handleNavigate} activeCharacter={activeCharacter} onAddFood={handleAddFood} onDeleteFood={(id) => setFoodLogs(f => f.filter(x => x.id !== id))} onUpdateFood={(u) => setFoodLogs(f => f.map(x => x.id === u.id ? u : x))} foodLogs={filteredFoodLogs} targetCalories={dailyCalorieLimit} onToggleOverlay={setIsOverlayOpen} />;
      case Screen.WATER_LOG: return <WaterLog onNavigate={handleNavigate} waterLogs={filteredWaterLogs} onAddWater={handleAddWater} onDeleteWater={(id) => setWaterLogs(w => w.filter(x => x.id !== id))} onUpdateWater={(u) => setWaterLogs(w => w.map(x => x.id === u.id ? u : x))} unitSystem={unitSystem} />;
      case Screen.ANALYTICS: return <Analytics foodLogs={filteredFoodLogs} workoutLogs={filteredWorkoutLogs} meditationLogs={filteredMeditationLogs} waterLogs={filteredWaterLogs} fastingLogs={filteredFastingLogs} onNavigate={handleNavigate} onUpdateWorkout={(u) => setWorkoutLogs(w => w.map(x => x.id === u.id ? u : x))} onUpdateMeditation={(u) => setMeditationLogs(m => m.map(x => x.id === u.id ? u : x))} onDeleteWorkout={(id) => setWorkoutLogs(w => w.filter(x => x.id !== id))} onDeleteMeditation={(id) => setMeditationLogs(m => m.filter(x => x.id !== id))} dailyCalorieLimit={dailyCalorieLimit} onToggleOverlay={setIsOverlayOpen} />;
      case Screen.ACHIEVEMENTS: return <Achievements onNavigate={handleNavigate} inventory={inventory} activeCharacter={activeCharacter} />;
      case Screen.SETTINGS: return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} activeCharacter={activeCharacter} onNavigate={handleNavigate} unitSystem={unitSystem} />;
      case Screen.PROFILE: return <Profile onNavigate={handleNavigate} userStats={userStats} activeCharacter={activeCharacter} unitSystem={unitSystem} workoutLogs={workoutLogs} meditationLogs={meditationLogs} />;
      case Screen.BIOMETRICS: return <Biometrics onNavigate={handleNavigate} unitSystem={unitSystem} />;
      case Screen.MANUAL_WORKOUT: return <ManualWorkoutEntry onNavigate={handleNavigate} logs={filteredWorkoutLogs} onDeleteWorkout={(id) => setWorkoutLogs(w => w.filter(x => x.id !== id))} onManualLog={(data) => handleSessionComplete('workout', data)} />;
      case Screen.MANUAL_MEDITATION: return <ManualMeditationEntry onNavigate={handleNavigate} logs={filteredMeditationLogs} onDeleteMeditation={(id) => setMeditationLogs(m => m.filter(x => x.id !== id))} onManualLog={(data) => handleSessionComplete('meditation', data)} />;
      case Screen.CLAIM_REWARD: return <ClaimReward activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} onNavigate={handleNavigate} onUnlock={handleUnlock} />;
      case Screen.WARDROBE: return <Wardrobe activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} inventory={inventory} onNavigate={handleNavigate} />;
      case Screen.SETTINGS_UNITS: return <SettingsUnits onNavigate={handleNavigate} currentSystem={unitSystem} onApply={handleUpdateUnitSystem} />;
      case Screen.SETTINGS_NOTIFICATIONS: return <SettingsNotifications onNavigate={handleNavigate} onToggleOverlay={setIsOverlayOpen} />;
      case Screen.SETTINGS_APPS: return <SettingsApps onNavigate={handleNavigate} />;
      case Screen.SETTINGS_MEMBERSHIP: return <SettingsMembership onNavigate={handleNavigate} />;
      case Screen.COMPANIONS: return <Companions activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} onBack={() => handleNavigate(Screen.HOME)} />;
      default: return <Welcome onNavigate={handleNavigate} />;
    }
  };

  const isMainApp = [Screen.HOME, Screen.ANALYTICS, Screen.ACHIEVEMENTS, Screen.SETTINGS, Screen.COMPANIONS, Screen.PROFILE].includes(currentScreen);
  const shouldShowNav = isMainApp && !isOverlayOpen;

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-light-bg dark:bg-dark-bg shadow-2xl overflow-hidden relative transition-colors duration-300">
      
      {shouldShowNav && currentScreen !== Screen.PROFILE && (
        <DateHeader 
          activeCharacter={activeCharacter} 
          selectedDate={selectedDate} 
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onProfileClick={() => handleNavigate(Screen.PROFILE)}
          onSelectDate={setSelectedDate}
        />
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar relative z-10 ${shouldShowNav ? 'pb-28' : ''}`}>
        {renderScreen()}
      </main>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-auto">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in" onClick={() => setIsMenuOpen(false)}></div>
           <div className="absolute bottom-28 left-0 right-0 px-8 flex flex-col gap-3 items-center animate-fade-in-up z-10 pointer-events-none">
              <div className="w-full max-w-[280px] flex flex-col gap-3 pointer-events-auto">
                 <MenuOption label="Log Meal" icon="restaurant" color="bg-orange-500 text-white" onClick={() => handleNavigate(Screen.FOOD_LOG)} delay="0ms" />
                 <MenuOption label="Hydration" icon="water_drop" color="bg-blue-500 text-white" onClick={() => handleNavigate(Screen.WATER_LOG)} delay="50ms" />
                 <MenuOption label="Record Workout" icon="fitness_center" color="bg-red-500 text-white" onClick={() => handleNavigate(Screen.MANUAL_WORKOUT)} delay="100ms" />
                 <MenuOption label="Mindfulness" icon="self_improvement" color="bg-teal-500 text-white" onClick={() => handleNavigate(Screen.MANUAL_MEDITATION)} delay="150ms" />
              </div>
           </div>
        </div>
      )}

      {shouldShowNav && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 px-6 pb-6 pt-0 pointer-events-none">
          <div className="bg-white/95 dark:bg-[#1C1C1E] backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] h-20 flex justify-between items-center shadow-2xl shadow-black/10 pointer-events-auto px-4 relative">
            <NavItem icon="home" label="Home" isActive={currentScreen === Screen.HOME} onClick={() => handleNavigate(Screen.HOME)} />
            <NavItem icon="bar_chart" label="Stats" isActive={currentScreen === Screen.ANALYTICS} onClick={() => handleNavigate(Screen.ANALYTICS)} />
            <div className="w-16"></div> 
            <NavItem icon="emoji_events" label="Rewards" isActive={currentScreen === Screen.ACHIEVEMENTS} onClick={() => handleNavigate(Screen.ACHIEVEMENTS)} />
            <NavItem icon="settings" label="Settings" isActive={currentScreen === Screen.SETTINGS} onClick={() => handleNavigate(Screen.SETTINGS)} />
            <button 
                onClick={toggleMenu}
                className={`absolute left-1/2 -translate-x-1/2 -top-8 size-16 bg-yellow-400 dark:bg-yellow-400 rounded-full shadow-[0_8px_30px_rgb(250,204,21,0.4)] flex items-center justify-center text-black transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white dark:border-[#1C1C1E] pointer-events-auto z-[60] ${isMenuOpen ? 'rotate-45 bg-red-500 dark:bg-red-500 shadow-[0_8px_30px_rgb(239,68,68,0.4)]' : ''}`}
            >
                <span className="material-symbols-outlined text-4xl font-black">add</span>
            </button>
          </div>
        </div>
      )}

      {isCalendarOpen && (
        <CalendarModal 
          selectedDate={selectedDate} 
          onSelectDate={(d) => { setSelectedDate(d); setIsCalendarOpen(false); }} 
          onClose={() => setIsCalendarOpen(false)} 
        />
      )}
    </div>
  );
};

const DateHeader: React.FC<{ 
  activeCharacter: Character; 
  selectedDate: Date; 
  onOpenCalendar: () => void;
  onProfileClick: () => void;
  onSelectDate: (d: Date) => void;
}> = ({ activeCharacter, selectedDate, onOpenCalendar, onProfileClick, onSelectDate }) => {
  const getDayName = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const getDayNum = (d: Date) => d.getDate();
  const getMonthName = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  const yesterday = new Date(selectedDate);
  yesterday.setDate(selectedDate.getDate() - 1);
  const dayBefore = new Date(yesterday);
  dayBefore.setDate(yesterday.getDate() - 1);

  return (
    <header className="flex items-center justify-between px-6 pt-12 pb-4 z-40 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-2xl sticky top-0 border-b border-black/5 dark:border-white/5 select-none pointer-events-auto">
      {/* Top Left Corner: Dates now clickable as buttons to navigate */}
      <div className="flex gap-4 min-w-[100px]">
          <button 
            onClick={() => onSelectDate(dayBefore)}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter leading-none group-hover:text-yellow-500">{getDayName(dayBefore)}</span>
              <span className="text-lg font-black text-gray-300 tracking-tighter leading-none my-0.5 group-hover:text-yellow-500">{getDayNum(dayBefore)}</span>
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter leading-none group-hover:text-yellow-500">{getMonthName(dayBefore)}</span>
          </button>
          <button 
            onClick={() => onSelectDate(yesterday)}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none group-hover:text-yellow-500">{getDayName(yesterday)}</span>
              <span className="text-lg font-black text-gray-400 tracking-tighter leading-none my-0.5 group-hover:text-yellow-500">{getDayNum(yesterday)}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none group-hover:text-yellow-500">{getMonthName(yesterday)}</span>
          </button>
      </div>

      <button 
        onClick={onOpenCalendar}
        className="flex items-center gap-3 bg-[#FDFBF7] dark:bg-[#1C1C1E] px-6 py-2.5 rounded-full border border-gray-100 dark:border-white/10 shadow-lg active:scale-95 group backdrop-blur-xl relative cursor-pointer pointer-events-auto"
      >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-dark-bg px-2 rounded-full border border-gray-100 dark:border-white/5">
            <span className="text-[8px] font-black text-gray-400">2025</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-gray-800 dark:text-white leading-none">
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <span className="material-symbols-outlined text-yellow-400 text-lg font-bold">calendar_today</span>
      </button>

      <button onClick={onProfileClick} className="size-11 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-md bg-white dark:bg-dark-surface p-0.5 cursor-pointer pointer-events-auto">
          <img src={activeCharacter.image} className="w-full h-full object-cover object-top" alt="Profile" />
      </button>
    </header>
  );
};

// Compact, Complete CalendarModal
const CalendarModal: React.FC<{ selectedDate: Date; onSelectDate: (d: Date) => void; onClose: () => void }> = ({ selectedDate, onSelectDate, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const [yearInput, setYearInput] = useState(viewDate.getFullYear().toString());
    
    const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    
    const changeMonth = (delta: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setViewDate(newDate);
        setYearInput(newDate.getFullYear().toString());
    };
    
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYearInput(e.target.value);
        const year = parseInt(e.target.value);
        if (!isNaN(year) && year > 1900 && year < 2100) {
            const newDate = new Date(viewDate);
            newDate.setFullYear(year);
            setViewDate(newDate);
        }
    };
    
    const generateDays = () => {
        const days = [];
        const totalDays = daysInMonth(viewDate);
        const startDay = firstDayOfMonth(viewDate); 
        const today = new Date();
        today.setHours(0,0,0,0);
        
        for (let i = 0; i < startDay; i++) { 
            days.push(<div key={`empty-${i}`} className="size-8"></div>); 
        }
        
        for (let i = 1; i <= totalDays; i++) {
            const currentDayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
            const isSelected = formatDateKey(currentDayDate) === formatDateKey(selectedDate);
            const isActuallyToday = formatDateKey(currentDayDate) === formatDateKey(new Date());
            const isFuture = currentDayDate > today;
            
            days.push(
                <button key={i} disabled={isFuture} onClick={() => onSelectDate(currentDayDate)}
                    className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative ${
                        isSelected 
                        ? 'bg-yellow-400 dark:bg-yellow-500 text-black dark:text-dark-bg shadow-md scale-105 z-10' 
                        : isActuallyToday 
                            ? 'bg-yellow-400/10 dark:bg-yellow-500/10 border-2 border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400 font-black' 
                            : isFuture 
                                ? 'text-gray-200 dark:text-gray-800 cursor-not-allowed' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-dark-surface w-full max-w-[320px] rounded-[2.5rem] p-5 shadow-2xl animate-pop-in border border-white/20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-gray-400">chevron_left</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest">{viewDate.toLocaleDateString('en-US', { month: 'long' })}</span>
                        <input 
                            type="number" 
                            value={yearInput} 
                            onChange={handleYearChange} 
                            className="w-16 bg-transparent text-[10px] font-black text-gray-400 dark:text-gray-500 focus:text-yellow-500 outline-none text-center transition-colors appearance-none" 
                        />
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                    </button>
                </div>
                
                <div className="grid grid-cols-7 gap-y-1 place-items-center mb-3">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                        <span key={i} className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">{d}</span>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-y-1 gap-x-1 place-items-center">
                    {generateDays()}
                </div>
                
                <button 
                    onClick={onClose} 
                    className="w-full mt-6 py-3.5 bg-[#F9F9F9] dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border border-gray-100 dark:border-white/5 active:scale-95"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 group ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}>
      <div className={`size-10 rounded-xl flex items-center justify-center transition-colors mb-0.5 ${isActive ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/5'}`}>
        <span className={`material-symbols-outlined text-[28px] ${isActive ? 'filled' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      </div>
      <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-400'}`}>{label}</span>
    </button>
);

const MenuOption: React.FC<{ label: string; icon: string; color: string; onClick: () => void; delay: string }> = ({ label, icon, color, onClick, delay }) => (
  <button onClick={onClick} className={`flex items-center justify-between w-full p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-white/10 shadow-lg transform transition-all hover:scale-105 active:scale-95`} style={{ animationDelay: delay }}>
    <span className="font-bold text-gray-800 dark:text-white uppercase tracking-wide text-xs pl-2">{label}</span>
    <div className={`size-9 rounded-full ${color} flex items-center justify-center shadow-md`}><span className="material-symbols-outlined text-lg">{icon}</span></div>
  </button>
);

export default App;
