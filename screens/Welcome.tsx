import React from 'react';
import { Screen } from '../types';

interface WelcomeProps {
  onNavigate: (screen: Screen) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-light-bg dark:bg-dark-bg overflow-hidden">
      {/* Top Section: Visual */}
      <div className="relative h-[55vh] w-full flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 w-full h-full rounded-b-[2.5rem] overflow-hidden z-0 shadow-2xl shadow-light-primary/20 dark:shadow-dark-primary/20">
          <div 
            className="w-full h-full bg-cover bg-center animate-zoom-pan will-change-transform" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQ2NVgst-ftlkjGEgLogelH42fohL1Npg5GUz7cxf9h6tFfXhAVi2gWV012NIASPLfoZpuhz7chC3omQQkXECEkcju-3EgrT4jFkIazo2O2Hs25uaaPR2cxoENtyjY4w7DL5iQ59wn2MV5LeKYzVaOHGN7x-wPEJQVZVLuA5378wQEWbpFrbpRtEA2FSo4g6kL57-xrzs0Nrmgd4o4Cs02w1P3Cq5YYujL7EM_1xHAXsLlLad3vP-A5XG53-kXG2Ia05NlEGKxEZib")', backgroundPosition: 'center top' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-light-bg/10 dark:via-dark-bg/20 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Floating Badge */}
        <div className="absolute top-12 left-0 right-0 flex justify-center z-10 animate-float">
          <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/40 shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-light-primary dark:text-dark-primary text-[22px] filled animate-pulse-slow" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="text-xs font-bold tracking-widest uppercase text-light-text dark:text-white">Fitopia</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 pt-6 pb-10 z-10">
        <div className="flex flex-col items-center w-full">
          {/* Pagination Indicators */}
          <div className="flex flex-row items-center justify-center gap-2 mb-6 animate-fade-in-up delay-100 opacity-0 fill-mode-forwards">
            <div className="h-2 w-8 rounded-full bg-light-primary dark:bg-dark-primary transition-all duration-300"></div>
            <div className="h-2 w-2 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 transition-all duration-300"></div>
            <div className="h-2 w-2 rounded-full bg-light-primary/20 dark:bg-dark-primary/20 transition-all duration-300"></div>
          </div>

          <div className="text-center space-y-3 max-w-[320px]">
            <h1 className="text-light-text dark:text-dark-text text-[38px] font-black leading-[1.05] tracking-tight animate-fade-in-up delay-200 opacity-0 fill-mode-forwards">
              Welcome to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-orange-400 dark:from-dark-primary dark:to-green-400">Fitopia</span>
            </h1>
            <p className="text-light-text/80 dark:text-dark-text/80 text-base font-medium leading-relaxed pt-2 animate-fade-in-up delay-300 opacity-0 fill-mode-forwards">
              Don't be a sloth! Join the ZPD (Zootopia Physical Development). Track calories, earn badges, and hustle your way to health!
            </p>
          </div>
        </div>

        {/* Action Button Area */}
        <div className="w-full mt-auto pt-8 animate-fade-in-up delay-500 opacity-0 fill-mode-forwards">
          <button 
            onClick={() => onNavigate(Screen.SIGNUP)}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-full h-16 bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg shadow-xl shadow-light-primary/40 dark:shadow-dark-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-light-primary/30 dark:focus:ring-dark-primary/30"
            aria-label="Start Your Journey"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></span>
            <span className="text-xl font-bold tracking-wide mr-2 z-10">Start Your Journey</span>
            <span className="material-symbols-outlined z-10 transition-transform duration-300 group-hover:translate-x-1 text-2xl">arrow_forward</span>
          </button>
          
          <div className="mt-5 text-center animate-fade-in-up delay-700 opacity-0 fill-mode-forwards">
            <p className="text-sm font-medium text-light-muted dark:text-dark-muted flex items-center justify-center gap-1">
              Already have an account? 
              <button 
                onClick={() => onNavigate(Screen.LOGIN)}
                className="text-light-text dark:text-dark-text font-extrabold hover:underline decoration-light-primary dark:decoration-dark-primary decoration-2 underline-offset-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary hover:text-light-primary dark:hover:text-dark-primary transition-colors"
                aria-label="Log in to your account"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;