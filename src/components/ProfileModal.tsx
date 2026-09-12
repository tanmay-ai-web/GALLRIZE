import React from 'react';
import { User, X, Cloud, HardDrive, Smartphone, Check, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">iCloud & Device Sync</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Apple ID Account</span>
            <span className="text-xs text-zinc-400">tanmayjain2328@gmail.com</span>
          </div>
        </div>

        {/* Sync Status Grid */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] flex items-center justify-between border border-white/[0.06]">
            <div className="flex items-center gap-2 text-zinc-300">
              <Cloud className="w-4 h-4 text-blue-400" />
              <span>iCloud Photo Library</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Synced
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] flex items-center justify-between border border-white/[0.06]">
            <div className="flex items-center gap-2 text-zinc-300">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <span>iPhone On-Device Storage</span>
            </div>
            <span className="text-zinc-300 font-semibold">45.6 GB / 64 GB</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] flex items-center justify-between border border-white/[0.06]">
            <div className="flex items-center gap-2 text-zinc-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Gallrize Pro Membership</span>
            </div>
            <span className="text-emerald-400 font-bold">Lifetime Active</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
