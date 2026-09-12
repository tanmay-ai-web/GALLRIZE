import React, { useState } from 'react';
import { AppSettings, PhotoItem } from '../types';
import { soundFx } from '../utils/audio';
import {
  Moon,
  Sun,
  Laptop,
  Sliders,
  Sparkles,
  ArrowUp,
  Vibrate,
  ShieldCheck,
  Smartphone,
  Layers,
  Video,
  FastForward,
  Trash2,
  History,
  Shield,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  pendingQueueCount: number;
  pendingQueueMB: number;
  onGoToReview: () => void;
  deletionHistory: PhotoItem[];
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  pendingQueueCount,
  pendingQueueMB,
  onGoToReview,
  deletionHistory,
}) => {
  const [cacheCleared, setCacheCleared] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleClearCache = () => {
    soundFx.triggerHaptic('light');
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const queueGB = (pendingQueueMB / 1024).toFixed(1);

  return (
    <div className="flex flex-col flex-1 max-w-md mx-auto px-4 pt-3 pb-28 space-y-4">
      {/* Storage Recovery Hero Card (Matches Image 9) */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#18181b] border border-white/[0.08] p-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[210px]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              TRIAGE READY
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Storage Recovery</h2>
            <p className="text-xs text-zinc-400 leading-snug">
              {queueGB} GB queued for instant cleanup out of 64 GB capacity
            </p>
          </div>

          {/* Circular Storage Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background ring */}
              <path
                className="text-zinc-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Foreground Coral Arc */}
              <path
                className="text-[#ef4444]"
                strokeDasharray="28, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-white">{queueGB}</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">GB</span>
            </div>
          </div>
        </div>

        {/* Bottom review bar */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>{pendingQueueCount} items in pending queue</span>
          </div>

          <button
            type="button"
            onClick={onGoToReview}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ef4444] hover:bg-red-600 text-white text-[11px] font-bold transition-all shadow-md shadow-red-500/20 cursor-pointer"
          >
            <span>Review Queue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* APPEARANCE SECTION (Matches Image 9) */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-1.5">
          <Sun className="w-3 h-3" />
          <span>APPEARANCE</span>
        </span>

        <div className="p-1.5 rounded-2xl bg-[#18181b] border border-white/[0.08] grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              settings.theme === 'dark'
                ? 'bg-[#27272a] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'light' })}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              settings.theme === 'light'
                ? 'bg-zinc-200 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'system' })}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              settings.theme === 'system'
                ? 'bg-[#27272a] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* CLEANING & GESTURES SECTION (Matches Image 9) */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-1.5">
          <Sliders className="w-3 h-3" />
          <span>CLEANING & GESTURES</span>
        </span>

        <div className="rounded-2xl bg-[#18181b] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
          {/* Swipe Sensitivity */}
          <div className="p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-300">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Swipe Sensitivity</span>
                  <span className="text-[11px] text-zinc-400">Drag threshold required to commit swipe</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/[0.08] text-white capitalize">
                {settings.swipeSensitivity}
              </span>
            </div>

            {/* Slider with labels */}
            <div className="pt-1 px-1">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={settings.swipeSensitivity === 'low' ? 0 : settings.swipeSensitivity === 'medium' ? 1 : 2}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const mode = val === 0 ? 'low' : val === 1 ? 'medium' : 'high';
                  onUpdateSettings({ swipeSensitivity: mode });
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-medium text-zinc-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Swipe Up Action */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-300">
                <ArrowUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Swipe Up Action</span>
                <span className="text-[11px] text-zinc-400">Shortcut gesture behavior</span>
              </div>
            </div>

            <select
              value={settings.swipeUpAction}
              onChange={(e) => onUpdateSettings({ swipeUpAction: e.target.value as 'favorite' | 'info' | 'skip' })}
              className="bg-[#27272a] text-zinc-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 border border-white/10 outline-none cursor-pointer"
            >
              <option value="favorite">Favorite & Keep</option>
              <option value="info">Inspect Info</option>
              <option value="skip">Skip Photo</option>
            </select>
          </div>

          {/* Haptic Feedback */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-300">
                <Vibrate className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Haptic & Sound Feedback</span>
                <span className="text-[11px] text-zinc-400">Tactile feel on photo decisions</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hapticFeedback}
                onChange={(e) => {
                  soundFx.setSoundEnabled(e.target.checked);
                  onUpdateSettings({ hapticFeedback: e.target.checked, soundEffects: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>

          {/* Require Delete Confirmation */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Require Delete Confirmation</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Recommended safe mode</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireDeleteConfirmation}
                onChange={(e) => onUpdateSettings({ requireDeleteConfirmation: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* GALLERY & FILTER SCOPE SECTION (Matches Image 9) */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-1.5">
          <Smartphone className="w-3 h-3" />
          <span>GALLERY & FILTER SCOPE</span>
        </span>

        <div className="rounded-2xl bg-[#18181b] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
          {/* Include Screenshots */}
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Include Screenshots</span>
              <span className="text-[11px] text-zinc-400">Flag unneeded receipts and screen grabs</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeScreenshots}
                onChange={(e) => onUpdateSettings({ includeScreenshots: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>

          {/* Include Bursts & Live Photos */}
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Include Bursts & Live Photos</span>
              <span className="text-[11px] text-zinc-400">Surface key frames & redundant shots</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeBursts}
                onChange={(e) => onUpdateSettings({ includeBursts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>

          {/* Include Videos */}
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Include Videos</span>
              <span className="text-[11px] text-zinc-400">Review large files and clips</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeVideos}
                onChange={(e) => onUpdateSettings({ includeVideos: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>

          {/* Auto Advance */}
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Auto-Advance after Swipe</span>
              <span className="text-[11px] text-zinc-400">Immediately present next photo in deck</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAdvance}
                onChange={(e) => onUpdateSettings({ autoAdvance: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* STORAGE & CACHE SECTION (Matches Image 9) */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-1.5">
          <History className="w-3 h-3" />
          <span>STORAGE & CACHE</span>
        </span>

        <div className="rounded-2xl bg-[#18181b] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
          {/* Clear Thumbnail Cache */}
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Clear Thumbnail Cache</span>
              <span className="text-[11px] text-zinc-400">Temporary visual assets & render cache</span>
            </div>

            <button
              type="button"
              onClick={handleClearCache}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>{cacheCleared ? 'Cleared ✓' : '142 MB'}</span>
              <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>

          {/* Review Deletion History */}
          <div
            onClick={() => setShowHistoryModal(true)}
            className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-white block">Review Deletion History</span>
              <span className="text-[11px] text-zinc-400">Audit recently permanently removed files</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* ABOUT SECTION (Matches Image 9) */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-1.5">
          <HelpCircle className="w-3 h-3" />
          <span>ABOUT</span>
        </span>

        <div className="rounded-2xl bg-[#18181b] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Gallrize Pro</span>
              <span className="text-[11px] text-zinc-400">Version 1.4.0 (Build 204)</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              UP TO DATE
            </span>
          </div>

          <div
            onClick={() => setShowHelpModal(true)}
            className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-xs font-semibold text-zinc-300">Privacy Policy</span>
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </div>

          <div
            onClick={() => setShowHelpModal(true)}
            className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <span className="text-xs font-semibold text-zinc-300">Help & Feedback</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <p className="text-center text-[11px] text-zinc-500 pt-3 pb-6 font-medium">
        Designed with care for peaceful photo libraries
      </p>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">Permanent Deletion Audit</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {deletionHistory.length > 0 ? (
                deletionHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.04]">
                    <span className="text-zinc-300 truncate max-w-[180px]">{item.filename}</span>
                    <span className="text-red-400 font-semibold">{item.sizeMB} MB purged</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 text-center py-6">No files permanently removed yet in this session.</p>
              )}
            </div>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help / Privacy Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-5 space-y-3">
            <h3 className="text-base font-bold text-white">Gallrize Security & Privacy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gallrize operates entirely on-device. Your personal photos, bursts, and location metadata are never uploaded to external servers. All similarity scans run within your device browser environment.
            </p>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-full bg-[#3b82f6] text-xs font-bold text-white transition-colors cursor-pointer mt-2"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
