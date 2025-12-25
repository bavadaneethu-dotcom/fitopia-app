
import React, { useState } from 'react';
import { Screen } from '../types';

interface ForgotPasswordProps {
  onNavigate: (screen: Screen) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call
    setError('');
    setIsSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Top Image Section - consistent with Login/Signup */}
      <div className="relative h-[30vh] w-full flex-shrink-0 z-0">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
           {/* Reuse similar hero image but maybe distinct positioning or different image if desired */}
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALYAkVTleYB9PnBfGFEaBR8cBK5ecxwa7301ozYZWHe1VZnZn4v_D6jmwsEl-SuZ7-OC1bAbu7lu0KLj_29aO1enWqWThhuilnhd7rwLXxuSOzkd_SIxddB7AeBQL5S8UtQ6Deb4O-oL0_TFjku4BKEi3g3xLxg-EtuwNjo3xdTqiblulJucTwuVx7zyM9gEV4lR1Hhau8oiUPXZpkZ59tDJRRIpjpl4UNV413bMOtmAXu9fSmR8ZiOl8wBc1jFhy72xnMOFXwqPGv")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        {/* Header Icons */}
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-10">
          <button 
            onClick={() => onNavigate(Screen.LOGIN)}
            className="bg-white/20 dark:bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 text-white hover:bg-white/30 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="bg-white/90 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
             <span className="material-symbols-outlined text-yellow-500 text-[16px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-gray-800 dark:text-white">Fitopia</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col bg-white dark:bg-dark-bg -mt-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 relative overflow-hidden">
         <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-10 pb-8 flex flex-col">
            
            <div className="text-center mb-8">
              <div className="size-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500 dark:text-yellow-400">
                  <span className="material-symbols-outlined text-3xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
              </div>
              <h1 className="text-3xl font-black text-light-text dark:text-dark-text mb-2 tracking-tight">Recovery Protocol</h1>
              <p className="text-light-text/60 dark:text-dark-text/60 text-sm font-medium">
                {isSubmitted 
                  ? "We've sent a secure reset link to your ZPD inbox." 
                  : "Enter your email address to receive a password reset link."}
              </p>
            </div>

            {isSubmitted ? (
               <div className="flex flex-col gap-4 animate-fade-in-up">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-2xl flex items-start gap-3">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                      <div className="text-sm text-green-800 dark:text-green-200">
                          <p className="font-bold mb-1">Check your email</p>
                          <p>If an account exists for <span className="font-bold">{email}</span>, you will receive instructions shortly.</p>
                      </div>
                  </div>

                  <button 
                    onClick={() => onNavigate(Screen.LOGIN)}
                    className="w-full mt-4 flex items-center justify-center rounded-full bg-yellow-400 dark:bg-yellow-500 py-4 px-4 text-base font-bold text-black dark:text-black shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
                  >
                    Return to Login
                  </button>
               </div>
            ) : (
                <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Email Address</label>
                        <div className={`relative group transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
                            <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${error ? 'text-red-500' : 'text-gray-400 group-focus-within:text-yellow-500'}`}>mail</span>
                            <input 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if(error) setError('');
                                }}
                                className={`w-full bg-gray-50 dark:bg-white/5 border-2 focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-light-text dark:text-dark-text outline-none transition-all ${
                                    error 
                                    ? 'border-red-300 focus:border-red-500 bg-red-50/50' 
                                    : 'border-transparent focus:border-yellow-400 placeholder:text-gray-300'
                                }`}
                                placeholder="name@example.com" 
                                type="email"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-[10px] font-bold text-red-500 ml-1 animate-fade-in">{error}</p>}
                    </div>

                    <div className="mt-auto">
                        <button 
                            type="submit" 
                            className="group relative w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black font-black text-base rounded-full py-4 shadow-xl shadow-yellow-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Send Reset Link</span>
                            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">send</span>
                        </button>
                    </div>
                </form>
            )}

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

export default ForgotPassword;
