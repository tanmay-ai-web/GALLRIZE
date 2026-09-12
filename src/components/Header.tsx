import React from 'react';
import { AppLogo } from './AppLogo';
import { User, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenHealth?: () => void;
  onOpenProfile?: () => void;
  cleanPercent?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHealth,
  onOpenProfile,
  cleanPercent = 84,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* App Branding */}
      <div className="flex items-center gap-2.5">
        <AppLogo size={32} />
        <span className="font-bold text-[17px] tracking-tight text-white flex items-center gap-1.5">
          Gallrize
        </span>
      </div>

      {/* Right Controls: Clean Health pill & Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHealth}
          type="button"
          aria-label="Library Health status"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 hover:bg-[#10b981]/25 transition-all cursor-pointer group active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
          <span className="text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
            {cleanPercent}% CLEAN
          </span>
        </button>

        <button
          onClick={onOpenProfile}
          type="button"
          aria-label="User Profile"
          className="w-8 h-8 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 flex items-center justify-center text-[#93c5fd] hover:bg-[#3b82f6]/30 transition-all cursor-pointer active:scale-95 overflow-hidden"
        >
          <User className="w-4 h-4 text-[#93c5fd]" />
        </button>
      </div>
    </header>
  );
};
