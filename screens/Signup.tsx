
import React, { useState } from 'react';
import { Screen } from '../types';
import { supabase } from '../supabase';

interface SignupProps {
  onNavigate: (screen: Screen) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    submit: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', confirmPassword: '', submit: '' };

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm Password Validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Profile creation is handled by Supabase Database Trigger
        onNavigate(Screen.CHARACTER_SELECT);
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrors(prev => ({ ...prev, submit: err.message || 'Failed to sign up' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear specific error when user types
    if (errors[field as keyof typeof errors]) {
      // @ts-ignore
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full bg-light-bg dark:bg-dark-bg animate-fade-in font-sans">
      {/* Top Image Section */}
      <div className="relative h-[30vh] w-full flex-shrink-0 z-0">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALYAkVTleYB9PnBfGFEaBR8cBK5ecxwa7301ozYZWHe1VZnZn4v_D6jmwsEl-SuZ7-OC1bAbu7lu0KLj_29aO1enWqWThhuilnhd7rwLXxuSOzkd_SIxddB7AeBQL5S8UtQ6Deb4O-oL0_TFjku4BKEi3g3xLxg-EtuwNjo3xdTqiblulJucTwuVx7zyM9gEV4lR1Hhau8oiUPXZpkZ59tDJRRIpjpl4UNV413bMOtmAXu9fSmR8ZiOl8wBc1jFhy72xnMOFXwqPGv")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Header Icons */}
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-10">
          <button
            onClick={() => onNavigate(Screen.WELCOME)}
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

      {/* Content Section - Pulled up to overlap */}
      <div className="flex-1 flex flex-col bg-white dark:bg-dark-bg -mt-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-8 pb-8">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-light-text dark:text-dark-text mb-2 tracking-tight">Join the Pack!</h1>
            <p className="text-light-text/60 dark:text-dark-text/60 text-sm font-medium">Create your account to start your journey.</p>
          </div>

          <button
            onClick={() => onNavigate(Screen.CHARACTER_SELECT)}
            className="relative w-full bg-gray-50 dark:bg-white/5 text-light-text dark:text-dark-text font-bold py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.98] mb-6"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span>Sign up with Google</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Or with email</span>
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl text-xs font-bold text-center">
              {errors.submit}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Email</label>
              <div className={`relative group transition-all duration-300 ${errors.email ? 'animate-shake' : ''}`}>
                <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-yellow-500'}`}>mail</span>
                <input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-white/5 border-2 focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-light-text dark:text-dark-text outline-none transition-all ${errors.email
                    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                    : 'border-transparent focus:border-yellow-400 placeholder:text-gray-300'
                    }`}
                  placeholder="name@example.com"
                  type="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Password</label>
              <div className={`relative group transition-all duration-300 ${errors.password ? 'animate-shake' : ''}`}>
                <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-yellow-500'}`}>lock</span>
                <input
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-white/5 border-2 focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-light-text dark:text-dark-text outline-none transition-all ${errors.password
                    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                    : 'border-transparent focus:border-yellow-400 placeholder:text-gray-300'
                    }`}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-light-text/70 dark:text-dark-text/70 ml-1">Confirm Password</label>
              <div className={`relative group transition-all duration-300 ${errors.confirmPassword ? 'animate-shake' : ''}`}>
                <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-gray-400 group-focus-within:text-yellow-500'}`}>lock_reset</span>
                <input
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-white/5 border-2 focus:bg-white dark:focus:bg-black/20 focus:ring-0 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-light-text dark:text-dark-text outline-none transition-all ${errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 bg-red-50/50'
                    : 'border-transparent focus:border-yellow-400 placeholder:text-gray-300'
                    }`}
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black font-black text-base rounded-full py-4 shadow-xl shadow-yellow-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                  </>
                )}
              </button>
              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <button type="button" onClick={() => onNavigate(Screen.LOGIN)} className="ml-1 text-gray-900 dark:text-white font-bold hover:underline">Log In</button>
                </p>
              </div>
            </div>
          </form>

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

export default Signup;
