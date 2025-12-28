import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Hide for this session
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if dismissed in this session or already installed
  if (!showPrompt || isInstalled || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 z-50 animate-fade-in-up pointer-events-auto">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-4 shadow-2xl border-4 border-yellow-400 dark:border-yellow-500 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="size-12 rounded-2xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-2xl text-black">download</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-sm text-gray-900 dark:text-white mb-1 uppercase tracking-tight">
              Install Fitopia
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              Add to home screen for quick access and offline use
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition-colors active:scale-95"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="size-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400 text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

