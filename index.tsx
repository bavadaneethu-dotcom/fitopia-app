
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = import.meta.env.BASE_URL + 'sw.js';
    navigator.serviceWorker.register(swPath, { scope: import.meta.env.BASE_URL })
      .then(registration => {
        console.log('[SW] Service Worker registered:', registration.scope);
        
        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, prompt user to reload
                console.log('[SW] New version available');
              }
            });
          }
        });
      })
      .catch(registrationError => {
        console.error('[SW] Registration failed:', registrationError);
      });
  });
}

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('[App] Back online');
});

window.addEventListener('offline', () => {
  console.log('[App] Gone offline');
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);