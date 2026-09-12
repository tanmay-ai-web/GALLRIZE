import React from 'react';
import { AppScreen } from '../types';
import { Flame, LayoutGrid, Trash2, Sliders } from 'lucide-react';

interface BottomNavProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
  deleteQueueCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  deleteQueueCount,
}) => {
  const tabs = [
    {
      id: 'swipe' as AppScreen,
      label: 'Swipe',
      icon: Flame,
    },
    {
      id: 'gallery' as AppScreen,
      label: 'Gallery',
      icon: LayoutGrid,
    },
    {
      id: 'review' as AppScreen,
      label: 'Review',
      icon: Trash2,
      badge: deleteQueueCount > 0 ? deleteQueueCount : undefined,
    },
    {
      id: 'settings' as AppScreen,
      label: 'Settings',
      icon: Sliders,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe pt-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="flex items-center justify-around py-1.5 px-2 rounded-[26px] bg-zinc-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.18)] ring-1 ring-white/10 mb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectScreen(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all cursor-pointer select-none group ${
                  isActive ? 'text-white' : 'text-[#71717a] hover:text-[#a1a1aa]'
                }`}
              >
                {/* Active subtle pill highlight */}
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-white/[0.08] border border-white/10 -z-10 animate-in fade-in duration-200" />
                )}

                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white stroke-[2.4]' : 'text-[#71717a] stroke-[1.8]'
                    }`}
                  />

                  {/* Badge for Review tab */}
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-3.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-[10px] font-extrabold text-white flex items-center justify-center shadow-lg shadow-red-500/30 ring-2 ring-[#09090b]">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] mt-1 font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-white' : 'text-[#71717a]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
