import React from 'react';
import { Screen } from '../types';

interface SignupProps {
  onNavigate: (screen: Screen) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-light-bg dark:bg-dark-bg animate-fade-in">
      <div className="relative h-[28vh] w-full flex-shrink-0 z-0">
        <div className="absolute inset-0 w-full h-full rounded-b-[2.5rem] overflow-hidden shadow-lg border-b border-white/5">
          <div className="w-full h-full bg-cover bg-center transform scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALYAkVTleYB9PnBfGFEaBR8cBK5ecxwa7301ozYZWHe1VZnZn4v_D6jmwsEl-SuZ7-OC1bAbu7lu0KLj_29aO1enWqWThhuilnhd7rwLXxuSOzkd_SIxddB7AeBQL5S8UtQ6Deb4O-oL0_TFjku4BKEi3g3xLxg-EtuwNjo3xdTqiblulJucTwuVx7zyM9gEV4lR1Hhau8oiUPXZpkZ59tDJRRIpjpl4UNV413bMOtmAXu9fSmR8ZiOl8wBc1jFhy72xnMOFXwqPGv")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-transparent to-black/30"></div>
        </div>
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-10">
          <button 
            onClick={() => onNavigate(Screen.WELCOME)}
            className="bg-white/20 dark:bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 text-white hover:bg-white/30 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="bg-white/90 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-light-primary dark:text-dark-primary text-[16px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-light-text dark:text-white">Fitopia</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-8 pb-8 -mt-4 z-10 overflow-y-auto no-scrollbar">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">Join the Pack!</h1>
          <p className="text-light-text/60 dark:text-dark-text/60 text-sm font-medium">Create your account to start your journey.</p>
        </div>

        <button className="relative w-full bg-white dark:bg-white/5 dark:text-dark-text text-light-text font-bold py-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] mb-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-light-text dark:text-dark-text">Sign up with Google</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
          <span className="text-[10px] font-bold tracking-widest text-light-text/40 dark:text-dark-text/40 uppercase">Or with email</span>
          <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
        </div>

        <form className="space-y-4 flex-1" onSubmit={(e) => { e.preventDefault(); onNavigate(Screen.CHARACTER_SELECT); }}>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Email</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-light-text/40 dark:text-dark-text/40 text-[20px] transition-colors group-focus-within:text-light-primary dark:group-focus-within:text-dark-primary">mail</span>
              <input 
                className="w-full bg-gray-50 dark:bg-white/5 border-transparent focus:border-light-primary dark:focus:border-dark-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-light-text dark:text-dark-text placeholder:text-light-text/30 dark:placeholder:text-dark-text/30 transition-all outline-none" 
                placeholder="name@example.com" 
                type="email"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-light-text/40 dark:text-dark-text/40 text-[20px] transition-colors group-focus-within:text-light-primary dark:group-focus-within:text-dark-primary">lock</span>
              <input 
                className="w-full bg-gray-50 dark:bg-white/5 border-transparent focus:border-light-primary dark:focus:border-dark-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-light-text dark:text-dark-text placeholder:text-light-text/30 dark:placeholder:text-dark-text/30 transition-all outline-none" 
                placeholder="••••••••" 
                type="password"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-light-text/40 dark:text-dark-text/40 hover:text-light-text dark:hover:text-dark-text transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Confirm Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-light-text/40 dark:text-dark-text/40 text-[20px] transition-colors group-focus-within:text-light-primary dark:group-focus-within:text-dark-primary">lock_reset</span>
              <input 
                className="w-full bg-gray-50 dark:bg-white/5 border-transparent focus:border-light-primary dark:focus:border-dark-primary focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-light-text dark:text-dark-text placeholder:text-light-text/30 dark:placeholder:text-dark-text/30 transition-all outline-none" 
                placeholder="••••••••" 
                type="password"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <button type="submit" className="group relative w-full bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-bg font-bold text-lg rounded-full py-4 shadow-lg shadow-light-primary/30 dark:shadow-dark-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>Sign Up</span>
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </button>
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-light-text/50 dark:text-dark-text/50">
                Already have an account? 
                <button onClick={() => onNavigate(Screen.LOGIN)} className="ml-1 text-light-text dark:text-dark-text font-bold hover:underline decoration-light-primary dark:decoration-dark-primary decoration-2 underline-offset-4">Log In</button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;