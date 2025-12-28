import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // For iOS, show manual install instructions after a delay
    if (iOS) {
      const timer = setTimeout(() => {
        const dismissed = sessionStorage.getItem('installPromptDismissed');
        if (!dismissed && !isStandalone) {
          setShowPrompt(true);
        }
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
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

  const handleShowIOSInstructions = () => {
    setShowIOSInstructions(true);
  };

  // Don't show if dismissed in this session or already installed
  if (!showPrompt || isInstalled || sessionStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 z-50 animate-fade-in-up pointer-events-auto">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-4 shadow-2xl border-4 border-yellow-400 dark:border-yellow-500 max-w-md mx-auto">
        {!showIOSInstructions ? (
          <div className="flex items-start gap-3">
            <div className="size-12 rounded-2xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl text-black">download</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-gray-900 dark:text-white mb-1 uppercase tracking-tight">
                Install Fitopia
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                {isIOS 
                  ? "Add to home screen for quick access and offline use"
                  : "Add to home screen for quick access and offline use"
                }
              </p>
              <div className="flex gap-2">
                {isIOS ? (
                  <button
                    onClick={handleShowIOSInstructions}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition-colors active:scale-95"
                  >
                    How to Install
                  </button>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    disabled={!deferredPrompt}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition-colors active:scale-95"
                  >
                    {deferredPrompt ? 'Install' : 'Install Available'}
                  </button>
                )}
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
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">
                Install on iOS
              </h3>
              <button
                onClick={handleDismiss}
                className="size-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-400 text-lg">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <span className="font-black text-yellow-400">1.</span>
                <p>Tap the <span className="font-bold">Share</span> button <span className="material-symbols-outlined text-base align-middle">ios_share</span> at the bottom</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-yellow-400">2.</span>
                <p>Scroll down and tap <span className="font-bold">"Add to Home Screen"</span></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-yellow-400">3.</span>
                <p>Tap <span className="font-bold">"Add"</span> in the top right</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition-colors active:scale-95"
            >
              Got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;

