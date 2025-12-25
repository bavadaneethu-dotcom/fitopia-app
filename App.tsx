
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

  // Fasting State (Lifted)
  const [isFasting, setIsFasting] = useState(false);
  const [fastStartTime, setFastStartTime] = useState<Date | null>(null);
  const [fastingPlan, setFastingPlan] = useState<FastingPlanConfig>({
    protocol: '16:8 Method',
    fastingHours: 16,
    eatingHours: 8
  });

  // User Data State (Lifted)
  const [userStats, setUserStats] = useState<UserStats>({
    name: '',
    dob: '',
    gender: 'male',
    age: '24',
    height: "5'10",
    weight: '165',
    activityLevel: 'Active'
  });

  // State to pass data to session timers
  const [activeSession, setActiveSession] = useState<{ title: string; icon: string; duration?: string; color?: string } | null>(null);

  // State for Navigation Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // History Logs
  const [workoutLogs, setWorkoutLogs] = useState<ActivityLog[]>([]);
  const [meditationLogs, setMeditationLogs] = useState<ActivityLog[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLogItem[]>([]);
  const [fastingLogs, setFastingLogs] = useState<FastingLog[]>([]);

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

  // Filter logs based on selected date
  const selectedDateKey = formatDateKey(selectedDate);
  const filteredWorkoutLogs = useMemo(() => workoutLogs.filter(log => log.date === selectedDateKey), [workoutLogs, selectedDateKey]);
  const filteredMeditationLogs = useMemo(() => meditationLogs.filter(log => log.date === selectedDateKey), [meditationLogs, selectedDateKey]);
  const filteredFoodLogs = useMemo(() => foodLogs.filter(log => log.date === selectedDateKey), [foodLogs, selectedDateKey]);
  const filteredWaterLogs = useMemo(() => waterLogs.filter(log => log.date === selectedDateKey), [waterLogs, selectedDateKey]);
  const filteredFastingLogs = useMemo(() => fastingLogs.filter(log => log.date === selectedDateKey), [fastingLogs, selectedDateKey]);

  // Helper to start a session and navigate
  const startSession = (screen: Screen, data: { title: string; icon: string; duration?: string; color?: string }) => {
    setActiveSession(data);
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
    setIsOverlayOpen(false); // Reset overlay on navigation
  };

  const handleSessionComplete = (type: 'workout' | 'meditation', data: any) => {
    const today = new Date();
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      title: data.title,
      icon: data.icon,
      duration: data.duration, 
      timestamp: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: formatDateKey(today),
      calories: data.calories,
      color: data.color
    };

    if (type === 'workout') {
      setWorkoutLogs(prev => [newLog, ...prev]);
    } else {
      setMeditationLogs(prev => [newLog, ...prev]);
    }
    // Ensure we are viewing today when a new log is added
    setSelectedDate(today);
    setCurrentScreen(Screen.HOME);
  };

  const handleAddFood = (item: FoodLogItem) => {
    const today = new Date();
    const newItem = { ...item, date: formatDateKey(today) };
    setFoodLogs(prev => [newItem, ...prev]);
    setSelectedDate(today);
  };

  const handleDeleteFood = (id: string) => {
    setFoodLogs(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateFood = (updatedItem: FoodLogItem) => {
    setFoodLogs(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  // Workout/Meditation Update Handlers
  const handleUpdateWorkout = (updatedLog: ActivityLog) => {
    setWorkoutLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleUpdateMeditation = (updatedLog: ActivityLog) => {
    setMeditationLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkoutLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleDeleteMeditation = (id: string) => {
    setMeditationLogs(prev => prev.filter(log => log.id !== id));
  };

  // Water Handlers
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

  const handleDeleteWater = (id: string) => {
    setWaterLogs(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateWater = (updatedItem: WaterLogItem) => {
    setWaterLogs(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  // Fasting Handlers
  const handleFastingStateChange = (fasting: boolean) => {
    if (!fasting && isFasting && fastStartTime) {
        // Ending a fast, record it
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
      case Screen.FORGOT_PASSWORD:
        return <ForgotPassword onNavigate={handleNavigate} />;
      case Screen.CHARACTER_SELECT:
        return <CharacterSelect activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} onNavigate={handleNavigate} />;
      case Screen.USER_DATA:
        return <UserData 
                  activeCharacter={activeCharacter} 
                  onNavigate={handleNavigate} 
                  userStats={userStats}
                  setUserStats={setUserStats}
               />;
      case Screen.GOAL_SELECTION:
        return <GoalSelection 
                  activeCharacter={activeCharacter} 
                  onNavigate={handleNavigate} 
                  userGoal={userGoal}
                  setUserGoal={setUserGoal}
               />;
      case Screen.FASTING_SETUP:
        return <FastingSetup 
                  activeCharacter={activeCharacter} 
                  onNavigate={handleNavigate} 
                  setFastingPlan={setFastingPlan}
               />;
      case Screen.PLAN_GENERATION:
        return <PlanGeneration 
                  activeCharacter={activeCharacter} 
                  onNavigate={handleNavigate} 
                  fastingPlan={fastingPlan}
                  calories={dailyCalorieLimit}
                  setCalories={setDailyCalorieLimit}
                  userStats={userStats}
                  userGoal={userGoal}
               />;
      case Screen.HOME:
        return <Home 
            character={activeCharacter} 
            onNavigate={handleNavigate} 
            onStartSession={startSession} 
            workoutLogs={filteredWorkoutLogs}
            meditationLogs={filteredMeditationLogs}
            foodLogs={filteredFoodLogs}
            waterLogs={filteredWaterLogs}
            isFasting={isFasting}
            fastStartTime={fastStartTime}
            unitSystem={unitSystem}
            dailyCalorieLimit={dailyCalorieLimit}
        />;
      case Screen.FASTING_TIMER:
        return <FastingTimer 
            onNavigate={handleNavigate} 
            isFasting={isFasting} 
            setIsFasting={handleFastingStateChange}
            fastStartTime={fastStartTime}
            setFastStartTime={setFastStartTime}
            fastingPlan={fastingPlan}
        />;
      case Screen.FOOD_LOG:
        return <FoodLog 
            onNavigate={handleNavigate} 
            activeCharacter={activeCharacter} 
            onAddFood={handleAddFood}
            onDeleteFood={handleDeleteFood}
            onUpdateFood={handleUpdateFood}
            foodLogs={filteredFoodLogs}
            targetCalories={dailyCalorieLimit}
            onToggleOverlay={setIsOverlayOpen}
        />;
      case Screen.FOOD_HISTORY:
        return <FoodHistory 
            onNavigate={handleNavigate} 
            foodLogs={foodLogs}
        />;
      case Screen.WATER_LOG:
        return <WaterLog 
            onNavigate={handleNavigate} 
            waterLogs={filteredWaterLogs}
            onAddWater={handleAddWater}
            onDeleteWater={handleDeleteWater}
            onUpdateWater={handleUpdateWater}
            unitSystem={unitSystem}
        />;
      case Screen.ANALYTICS:
        return <Analytics 
            foodLogs={filteredFoodLogs}
            workoutLogs={filteredWorkoutLogs}
            meditationLogs={filteredMeditationLogs}
            waterLogs={filteredWaterLogs}
            fastingLogs={filteredFastingLogs}
            onNavigate={handleNavigate}
            onUpdateWorkout={handleUpdateWorkout}
            onUpdateMeditation={handleUpdateMeditation}
            onDeleteWorkout={handleDeleteWorkout}
            onDeleteMeditation={handleDeleteMeditation}
            dailyCalorieLimit={dailyCalorieLimit}
            onToggleOverlay={setIsOverlayOpen}
        />;
      case Screen.WORKOUT_HISTORY:
        return <WorkoutHistory logs={workoutLogs} onNavigate={handleNavigate} />;
      case Screen.MINDFULNESS_HISTORY:
        return <MindfulnessHistory logs={meditationLogs} onNavigate={handleNavigate} />;
      case Screen.ACHIEVEMENTS:
        return <Achievements 
            onNavigate={handleNavigate} 
            inventory={inventory} 
            activeCharacter={activeCharacter} 
        />;
      case Screen.CLAIM_REWARD:
        return <ClaimReward 
            activeCharacter={activeCharacter} 
            setActiveCharacter={setActiveCharacter}
            onNavigate={handleNavigate} 
            onUnlock={handleUnlockItem} 
        />;
      case Screen.WARDROBE:
        return <Wardrobe activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} inventory={inventory} onNavigate={handleNavigate} />;
      case Screen.SETTINGS:
        return <Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} activeCharacter={activeCharacter} onNavigate={handleNavigate} unitSystem={unitSystem} />;
      case Screen.SETTINGS_UNITS:
        return <SettingsUnits onNavigate={handleNavigate} currentSystem={unitSystem} onApply={setUnitSystem} />;
      case Screen.SETTINGS_NOTIFICATIONS:
        return <SettingsNotifications onNavigate={handleNavigate} onToggleOverlay={setIsOverlayOpen} />;
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
            activeCharacter={activeCharacter}
            onComplete={(data) => handleSessionComplete('meditation', data)}
        />;
      case Screen.WORKOUT_TIMER:
        return <WorkoutTimer 
            onNavigate={handleNavigate} 
            sessionData={activeSession} 
            activeCharacter={activeCharacter}
            onComplete={(data) => handleSessionComplete('workout', data)}
        />;
      case Screen.MANUAL_MEDITATION:
        return <ManualMeditationEntry onNavigate={handleNavigate} onStartSession={startSession} />;
      case Screen.MANUAL_WORKOUT:
        return <ManualWorkoutEntry onNavigate={handleNavigate} onStartSession={startSession} />;
      case Screen.BIOMETRICS:
        return <Biometrics onNavigate={handleNavigate} unitSystem={unitSystem} />;
      case Screen.PROFILE:
        return <Profile 
            onNavigate={handleNavigate} 
            userStats={userStats} 
            activeCharacter={activeCharacter} 
            unitSystem={unitSystem}
            workoutLogs={workoutLogs}
            meditationLogs={meditationLogs}
        />;
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  // Check if we should show the main app navigation and header
  const isMainApp = [Screen.HOME, Screen.ANALYTICS, Screen.ACHIEVEMENTS, Screen.SETTINGS, Screen.COMPANIONS, Screen.PROFILE, Screen.SETTINGS_UNITS, Screen.SETTINGS_NOTIFICATIONS, Screen.SETTINGS_APPS, Screen.SETTINGS_MEMBERSHIP].includes(currentScreen);

  // Determine if header and footer should be rendered
  const shouldShowNav = isMainApp && !isOverlayOpen;

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-light-bg dark:bg-dark-bg shadow-2xl overflow-hidden relative transition-colors duration-300">
      
      {/* Header - Persistent (only in main app, hidden for Profile to avoid double headers) */}
      {shouldShowNav && currentScreen !== Screen.PROFILE && (
        <DateHeader 
          activeCharacter={activeCharacter} 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onProfileClick={() => handleNavigate(Screen.PROFILE)}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar relative z-10 ${shouldShowNav ? 'pb-28' : ''}`}>
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
      {shouldShowNav && (
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 px-6 pb-6 pt-4 pointer-events-none">
          <div className="bg-white/70 dark:bg-dark-surface/70 backdrop-blur-2xl border border-white/40 dark:border-white/5 rounded-[2.5rem] h-20 flex justify-between items-center shadow-2xl shadow-black/10 pointer-events-auto px-2 relative overflow-hidden">
            
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

      {/* Calendar Modal */}
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
  onDateSelect: (date: Date) => void;
  onOpenCalendar: () => void;
  onProfileClick: () => void;
}> = ({ activeCharacter, selectedDate, onDateSelect, onOpenCalendar, onProfileClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dateList, setDateList] = useState<Date[]>(() => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return [yesterday];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
  }, []); 
  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };
  const getDayName = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' });
  const getDayNum = (d: Date) => d.getDate();
  const getMonthName = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
  const handleStart = (clientX: number) => {
      if(!scrollRef.current) return;
      setIsDragging(true);
      setStartX(clientX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMove = (clientX: number) => {
      if (!isDragging || !scrollRef.current) return;
      const x = clientX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; 
      if (scrollRef.current.scrollLeft <= 0 && walk > 40) {
          const firstDate = dateList[0];
          const prevDate = new Date(firstDate);
          prevDate.setDate(firstDate.getDate() - 1);
          setDateList(prev => [prevDate, ...prev]);
          setIsDragging(false); 
          return;
      }
      scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleEnd = () => setIsDragging(false);
  return (
    <header className="flex items-center justify-between px-6 pt-12 pb-4 z-30 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-2xl sticky top-0 border-b border-white/20 select-none">
      <div className="relative w-28 h-16 overflow-hidden mr-auto flex-shrink-0">
         <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-transparent to-transparent z-10 pointer-events-none"></div>
         <div 
            ref={scrollRef}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.pageX)}
            onMouseMove={(e) => { e.preventDefault(); handleMove(e.pageX); }}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            className="flex gap-3 px-4 items-center overflow-x-auto no-scrollbar h-full w-full cursor-grab active:cursor-grabbing"
         >
            {dateList.map((d, i) => (
                <button 
                key={i} 
                onClick={() => {
                    onDateSelect(d);
                    if (i === 0) {
                         const prevDate = new Date(d);
                         prevDate.setDate(d.getDate() - 1);
                         setDateList(prev => [prevDate, ...prev]);
                    }
                }}
                className={`flex flex-col items-center justify-center shrink-0 transition-all duration-300 transform opacity-60 hover:opacity-100 scale-90 hover:scale-95`}
                >
                    <span className={`text-[9px] font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted`}>{getDayName(d)}</span>
                    <span className={`text-base font-bold leading-none text-light-text dark:text-white my-0.5`}>{getDayNum(d)}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-wide text-light-muted/70 dark:text-dark-muted/70`}>{getMonthName(d)}</span>
                </button>
            ))}
         </div>
      </div>
      <div className="absolute left-1/2 top-12 -translate-x-1/2 flex flex-col items-center z-20">
          <button 
            onClick={onOpenCalendar}
            className="flex items-center gap-2 bg-white/80 dark:bg-dark-surface/80 px-5 py-2.5 rounded-2xl border-2 border-white/60 dark:border-white/5 shadow-lg transition-transform active:scale-95 group backdrop-blur-xl"
          >
             <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-light-muted dark:text-dark-muted leading-tight">
                    {isToday(selectedDate) ? 'Today' : selectedDate.getFullYear()}
                </span>
                <span className="text-base font-black text-light-text dark:text-white leading-tight">
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
             </div>
             <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>
             <span className="material-symbols-outlined text-light-primary dark:text-dark-primary group-hover:scale-110 transition-transform">calendar_month</span>
          </button>
      </div>
      <div className="flex-1 flex flex-col items-end">
        <button onClick={onProfileClick} className="group relative">
            <div className="relative rounded-full size-11 overflow-hidden border-2 border-white dark:border-white/20 shadow-md group-hover:scale-105 transition-transform group-active:scale-95">
                <img src={activeCharacter.image} className="w-full h-full object-cover object-top" alt="Profile" />
            </div>
        </button>
      </div>
    </header>
  );
};
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

        for (let i = 0; i < startDay; i++) { days.push(<div key={`empty-${i}`} className="size-10"></div>); }
        for (let i = 1; i <= totalDays; i++) {
            const currentDayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
            const isSelected = formatDateKey(currentDayDate) === formatDateKey(selectedDate);
            const isActuallyToday = formatDateKey(currentDayDate) === formatDateKey(new Date());
            const isFuture = currentDayDate > today;

            days.push(
                <button 
                    key={i} 
                    disabled={isFuture}
                    onClick={() => onSelectDate(currentDayDate)}
                    className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-all relative ${
                        isSelected 
                        ? 'bg-light-primary dark:bg-dark-primary text-black dark:text-dark-bg shadow-lg scale-110 z-10' 
                        : isActuallyToday 
                            ? 'bg-light-primary/10 dark:bg-dark-primary/10 border-2 border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary font-black shadow-sm' 
                            : isFuture
                                ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return days;
    };
    return (
        <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-fade-in-up border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-wide">{viewDate.toLocaleDateString('en-US', { month: 'long' })}</span>
                        <input type="number" value={yearInput} onChange={handleYearChange} className="w-20 bg-transparent text-lg font-black text-gray-500 dark:text-gray-400 focus:text-light-primary dark:focus:text-dark-primary outline-none border-b-2 border-transparent focus:border-light-primary dark:focus:border-dark-primary text-center transition-colors appearance-none" />
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
                <div className="grid grid-cols-7 gap-y-2 place-items-center mb-2">{['S','M','T','W','T','F','S'].map((d, i) => (<span key={i} className="text-[10px] font-black text-gray-400 uppercase">{d}</span>))}</div>
                <div className="grid grid-cols-7 gap-y-2 place-items-center">{generateDays()}</div>
                <button onClick={onClose} className="w-full mt-6 py-4 bg-gray-100 dark:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">Close</button>
            </div>
        </div>
    );
};
const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 group ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}>
      <div className={`size-10 rounded-xl flex items-center justify-center transition-colors mb-1 ${isActive ? 'bg-light-primary/20 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary' : 'bg-transparent text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/5'}`}>
        <span className={`material-symbols-outlined text-2xl ${isActive ? 'filled' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-light-primary dark:text-dark-primary' : 'text-gray-400'}`}>{label}</span>
    </button>
);
const MenuOption: React.FC<{ label: string; icon: string; color: string; onClick: () => void; delay: string }> = ({ label, icon, color, onClick, delay }) => (
  <button onClick={onClick} className={`flex items-center justify-between w-full p-3.5 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-white/10 shadow-lg transform transition-all hover:scale-105 active:scale-95`} style={{ animationDelay: delay }}>
    <span className="font-bold text-gray-800 dark:text-white uppercase tracking-wide text-xs pl-2">{label}</span>
    <div className={`size-9 rounded-full ${color} flex items-center justify-center shadow-md`}><span className="material-symbols-outlined text-lg">{icon}</span></div>
  </button>
);

export default App;
