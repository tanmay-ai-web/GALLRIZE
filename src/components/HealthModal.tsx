import React from 'react';
import { Zap, X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  cleanPercent: number;
  onStartSprint: () => void;
}

export const HealthModal: React.FC<HealthModalProps> = ({
  isOpen,
  onClose,
  cleanPercent,
  onStartSprint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#10b981]">
            <Zap className="w-5 h-5 fill-[#10b981]" />
            <h3 className="text-base font-bold text-white">Library Health Status</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clean Score Circle & Stats */}
        <div className="p-4 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/25 flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-[#10b981]">{cleanPercent}%</span>
            <span className="text-xs font-bold text-white block mt-0.5">Optimized Library</span>
            <span className="text-[11px] text-zinc-400">18.4 GB indexed across 2,480 items</span>
          </div>

          <div className="w-12 h-12 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Category Breakdown Progress */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-zinc-300 font-medium">
            <span>Preserved Photos & Stars</span>
            <span className="text-[#10b981] font-bold">84%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#10b981] h-full w-[84%]" />
          </div>

          <div className="flex justify-between text-zinc-300 font-medium pt-1">
            <span>Duplicate Shots & Bursts</span>
            <span className="text-amber-400 font-bold">9%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[9%]" />
          </div>

          <div className="flex justify-between text-zinc-300 font-medium pt-1">
            <span>Unneeded Screenshots & Memes</span>
            <span className="text-red-400 font-bold">7%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-400 h-full w-[7%]" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onStartSprint();
          }}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <span>Run Clean Sprint to Reach 95%</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
