
import React, { useState } from 'react';
import { Screen } from '../types';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    let isValid = true;
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      isValid = false;
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }

    if (isValid) {
      onNavigate(Screen.HOME);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      // Clear error on change if it exists
      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-light-bg dark:bg-dark-bg animate-fade-in">
      <div className="relative h-[35vh] w-full flex-shrink-0">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALYAkVTleYB9PnBfGFEaBR8cBK5ecxwa7301ozYZWHe1VZnZn4v_D6jmwsEl-SuZ7-OC1bAbu7lu0KLj_29aO1enWqWThhuilnhd7rwLXxuSOzkd_SIxddB7AeBQL5S8UtQ6Deb4O-oL0_TFjku4BKEi3g3xLxg-EtuwNjo3xdTqiblulJucTwuVx7zyM9gEV4lR1Hhau8oiUPXZpkZ59tDJRRIpjpl4UNV413bMOtmAXu9fSmR8ZiOl8wBc1jFhy72xnMOFXwqPGv")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-transparent to-transparent pointer-events-none"></div>
        </div>
        <div className="absolute top-12 left-0 right-0 flex justify-center z-10">
          <div className="bg-white/90 dark:bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-light-primary dark:text-dark-primary text-[20px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="text-xs font-bold tracking-wide uppercase text-light-text dark:text-dark-text">Fitopia</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8 -mt-10 z-10 rounded-t-[2.5rem] bg-light-bg dark:bg-dark-bg shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="flex flex-col items-center w-full pt-8 pb-6 text-center">
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">Welcome Back!</h2>
          <p className="text-light-text/60 dark:text-dark-text/60 text-sm font-medium">Ready to run wild? Log in to continue.</p>
        </div>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold ml-1 text-light-text/80 dark:text-dark-text/80" htmlFor="email">Email</label>
            <div className={`relative group transition-all duration-300 ${errors.email ? 'animate-shake' : ''}`}>
              <input 
                className={`block w-full rounded-2xl border-2 bg-gray-50 dark:bg-white/5 py-4 px-5 pl-12 text-light-text dark:text-dark-text shadow-sm placeholder:text-gray-400 focus:outline-none transition-all duration-200 sm:text-sm sm:leading-6 ${
                  errors.email 
                  ? 'border-red-300 focus:border-red-500 bg-red-50/50' 
                  : 'border-transparent focus:border-light-primary dark:focus:border-dark-primary ring-1 ring-inset ring-black/5 dark:ring-white/10 focus:ring-2'
                }`}
                id="email" 
                name="email" 
                placeholder="judy.hopps@zpd.com" 
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className={`material-symbols-outlined text-[20px] transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400'}`}>mail</span>
              </div>
            </div>
            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold ml-1 text-light-text/80 dark:text-dark-text/80" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                className="block w-full rounded-2xl border-transparent bg-gray-50 dark:bg-white/5 py-4 px-5 pl-12 pr-12 text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:focus:ring-dark-primary sm:text-sm sm:leading-6 transition-all duration-200 outline-none" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>
              </div>
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-light-text dark:hover:text-dark-text transition-colors focus:outline-none" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={() => onNavigate(Screen.FORGOT_PASSWORD)}
                className="text-xs font-bold text-light-muted dark:text-dark-muted hover:text-light-primary dark:hover:text-dark-primary transition-colors hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-2 flex items-center justify-center rounded-full bg-yellow-400 dark:bg-yellow-500 py-4 px-4 text-base font-bold text-black dark:text-black shadow-lg shadow-yellow-400/25 dark:shadow-yellow-500/25 transition-all duration-300 hover:shadow-yellow-400/40 dark:hover:shadow-yellow-500/40 hover:scale-[1.01] active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <div className="relative py-6">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-light-bg dark:bg-dark-bg px-4 text-light-text/40 dark:text-dark-text/40">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={() => onNavigate(Screen.HOME)}
          className="relative w-full flex items-center justify-center gap-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 py-3.5 px-4 text-sm font-bold text-light-text dark:text-dark-text transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/10 active:scale-[0.98]" type="button"
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>

        <div className="mt-auto pt-6 text-center">
          <p className="text-sm font-medium text-light-text/60 dark:text-dark-text/60">
            Don't have an account? 
            <button onClick={() => onNavigate(Screen.SIGNUP)} className="ml-1 text-light-text dark:text-dark-text font-bold hover:underline decoration-light-primary dark:decoration-dark-primary decoration-2 underline-offset-2">Sign Up</button>
          </p>
        </div>
      </div>
      
      <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
      `}</style>
    </div>
  );
};

export default Login;
