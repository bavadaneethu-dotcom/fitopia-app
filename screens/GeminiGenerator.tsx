
import React, { useState } from 'react';
import { Screen, Character } from '../types';
import { generateCharacterImage } from '../GeminiService';

interface GeminiGeneratorProps {
  onNavigate: (screen: Screen) => void;
  activeCharacter: Character;
}

const GeminiGenerator: React.FC<GeminiGeneratorProps> = ({ onNavigate, activeCharacter }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    // API KEY CHECK MANDATORY
    if (!await (window as any).aistudio.hasSelectedApiKey()) {
      await (window as any).aistudio.openSelectKey();
      // Proceed assuming success as per instructions
    }

    setIsGenerating(true);
    try {
      const url = await generateCharacterImage(prompt, size);
      setGeneratedImageUrl(url);
    } catch (e) {
      console.error(e);
      alert("Generation failed. Check API key status.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg font-sans animate-fade-in">
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b dark:border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-800 dark:text-white uppercase leading-none tracking-tighter italic">Avatar Lab</h1>
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Nano Banana Pro</p>
          </div>
        </div>
        <button onClick={() => onNavigate(Screen.HOME)} className="size-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-500">close</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Preview Area */}
        <div className="w-full aspect-square rounded-[3rem] bg-white dark:bg-white/5 border-4 border-white dark:border-white/10 shadow-2xl overflow-hidden relative flex items-center justify-center group">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} className="w-full h-full object-cover" alt="Generated Partner" />
          ) : (
            <div className="text-center p-10 opacity-30 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-6xl">person_search</span>
              <p className="text-xs font-black uppercase tracking-widest">Design your own ZPD partner</p>
            </div>
          )}
          {isGenerating && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex flex-col items-center justify-center gap-4 animate-fade-in">
              <div className="size-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] animate-pulse">Rendering Reality...</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Character Description</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A muscle-bound rhinoceros wearing a ZPD traffic vest, standing in Sahara Square..."
              className="w-full h-32 p-5 rounded-3xl bg-white dark:bg-white/5 border-2 border-transparent focus:border-indigo-400 outline-none shadow-sm dark:text-white text-sm font-medium resize-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Render Resolution</label>
            <div className="grid grid-cols-3 gap-3">
              {(["1K", "2K", "4K"] as const).map((s) => (
                <button 
                  key={s} 
                  onClick={() => setSize(s)}
                  className={`py-3 rounded-2xl font-black text-xs transition-all border-2 ${size === s ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-transparent text-gray-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest">Higher resolution takes longer to render</p>
          </div>
        </div>
      </main>

      <div className="p-6 bg-white dark:bg-dark-bg border-t dark:border-white/10">
        <button 
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.8rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all"
        >
          <span className="material-symbols-outlined">sparkles</span>
          Generate Companion
        </button>
        <p className="text-center mt-4">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[9px] font-black text-gray-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">Requires Paid API Key</a>
        </p>
      </div>
    </div>
  );
};

export default GeminiGenerator;
