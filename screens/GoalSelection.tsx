
import React, { useState } from 'react';
import { Screen, Character } from '../types';

interface GoalSelectionProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter?: Character;
  userGoal: 'lose' | 'maintain' | 'gain';
  setUserGoal: (goal: 'lose' | 'maintain' | 'gain') => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onNavigate, activeCharacter, userGoal, setUserGoal }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#1a1a1a] text-light-text dark:text-white font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col items-center w-full pt-8 px-6 relative z-20 bg-white dark:bg-[#1a1a1a]">
        <div className="w-full flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate(Screen.USER_DATA)}
              className="size-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-800 dark:text-white text-xl">arrow_back</span>
            </button>
            
            <div className="px-4 py-1.5">
                <span className="text-[10px] font-black text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.2em]">Step 3 of 5</span>
            </div>

            <div className="size-12"></div> 
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-8 rounded-full bg-yellow-400 shadow-sm"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-36">
        
        {/* Headline */}
        <div className="py-2 mt-4 mb-6">
          <h1 className="text-[34px] font-black text-center text-[#4A4A4A] dark:text-white leading-[0.95] tracking-tight mb-6">
            Choose your <br/> <span className="text-[#6D5D4B] dark:text-gray-400">mission</span>
          </h1>
          
          <div className="flex gap-4 bg-[#F9F9F9] dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
             <div className="size-10 rounded-full bg-cover bg-top border-2 border-yellow-400 shrink-0" style={{ backgroundImage: `url("${activeCharacter?.image}")` }}></div>
             <p className="text-sm font-bold leading-relaxed text-gray-600 dark:text-gray-300 italic">
               "{activeCharacter?.onboardingMessages.goal || "So, what's the angle? Looking good or feeling good? I can help with both."}"
             </p>
          </div>
        </div>

        {/* Goal Selection Cards */}
        <div className="flex flex-col gap-4">
          
          {/* Option 1 */}
          <div 
            onClick={() => setUserGoal('lose')}
            className={`group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ease-out ${
              userGoal === 'lose' 
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-[1.02]' 
                : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <div className={`relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 ${userGoal === 'lose' ? 'border-yellow-400' : 'border-transparent'}`}>
              <img alt="Speed" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2NVgst-ftlkjGEgLogelH42fohL1Npg5GUz7cxf9h6tFfXhAVi2gWV012NIASPLfoZpuhz7chC3omQQkXECEkcju-3EgrT4jFkIazo2O2Hs25uaaPR2cxoENtyjY4w7DL5iQ59wn2MV5LeKYzVaOHGN7x-wPEJQVZVLuA5378wQEWbpFrbpRtEA2FSo4g6kL57-xrzs0Nrmgd4o4Cs02w1P3Cq5YYujL7EM_1xHAXsLlLad3vP-A5XG53-kXG2Ia05NlEGKxEZib"/>
            </div>
            <div className="flex flex-col flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-lg text-gray-800 dark:text-white leading-tight">Lose Weight</h3>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  userGoal === 'lose'
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-gray-300 bg-transparent'
                }`}>
                  {userGoal === 'lose' && <span className="material-symbols-outlined text-black text-[16px] font-bold">check</span>}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Get lean and agile.</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit uppercase tracking-wider">
                High Intensity
              </div>
            </div>
          </div>

          {/* Option 2 */}
          <div 
            onClick={() => setUserGoal('maintain')}
            className={`group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ease-out ${
              userGoal === 'maintain' 
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-[1.02]' 
                : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <div className={`relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 ${userGoal === 'maintain' ? 'border-yellow-400' : 'border-transparent'}`}>
              <img alt="Balance" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAiks3sR-IkTxLAWTNDcNPQgijP3Ps_i8uIHfg85TbVLCb92KCR-clDz5DMI5qQRJllUzO87UxKM1emRgnp9ExzztWFzAc6RQVe1Qjplhdups088A2AB2bW9Ixy7ycIqY8Y9Ia6jtXxmckEv-qEptMOrgOJDKxSQfAIfX46LkxihWo2mmLzKIHJ00CifvYfbvxYnYbl-7amM5kN-reohfOq9gkHIHhXzq2HMQgKMOAst3dh0qsj0yKLKcXCZtOkjlw2NboBga1l6GI"/>
            </div>
            <div className="flex flex-col flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-lg text-gray-800 dark:text-white leading-tight">Maintain</h3>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  userGoal === 'maintain'
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-gray-300 bg-transparent'
                }`}>
                  {userGoal === 'maintain' && <span className="material-symbols-outlined text-black text-[16px] font-bold">check</span>}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Stay fit and healthy.</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit uppercase tracking-wider">
                Balanced Routine
              </div>
            </div>
          </div>

          {/* Option 3 */}
          <div 
            onClick={() => setUserGoal('gain')}
            className={`group relative cursor-pointer flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ease-out ${
              userGoal === 'gain' 
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md scale-[1.02]' 
                : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          >
            <div className={`relative h-20 w-20 flex-shrink-0 rounded-full overflow-hidden border-2 ${userGoal === 'gain' ? 'border-yellow-400' : 'border-transparent'}`}>
              <img alt="Power" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtAxAVvgZdGafsxP0q1GSwEnsz77RblSvTNenr6FUzD3cCF_1rxKK4TOgiwR7xsYxdJH86lAAh834mjdEpedYkYVqwFE-B4WGYzUASFo385wuV48vBG4TNBr58Xwz649q3oFlQbyS4IZhGiJaGh-UcwohcWPTNexnXuicwydUwHSCghOvPsp_ei5xUMJNGeXZCnHfucXEMrztMKqCHoY1Elitrp6idCdcrBAaJSqlGPqT98-qUw8hBe_P4bfDVi00PKxySdux6VJM2"/>
            </div>
            <div className="flex flex-col flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-lg text-gray-800 dark:text-white leading-tight">Gain Muscle</h3>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  userGoal === 'gain'
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-gray-300 bg-transparent'
                }`}>
                  {userGoal === 'gain' && <span className="material-symbols-outlined text-black text-[16px] font-bold">check</span>}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Build strength & power.</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-fit uppercase tracking-wider">
                Strength Focus
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a] z-30 pt-16">
        <button 
          onClick={() => onNavigate(Screen.FASTING_SETUP)}
          className="flex w-full items-center justify-center rounded-full h-16 bg-[#FACC15] hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all gap-3"
        >
          <span className="material-symbols-outlined text-xl filled">bolt</span>
          Confirm Mission
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default GoalSelection;
