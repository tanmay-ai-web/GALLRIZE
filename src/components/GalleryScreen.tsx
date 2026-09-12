import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle2,
  Heart,
  Trash2,
  ChevronRight,
  Layers,
  Video,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Upload,
} from 'lucide-react';
import { PhotoItem } from '../types';

interface GalleryScreenProps {
  totalLibraryCount: number;
  totalLibraryGB: number;
  reviewedCount: number;
  reviewedGB: number;
  keptSafeCount: number;
  toDeleteCount: number;
  toDeleteMB: number;
  onStartSprint: (category?: string, targetCount?: number) => void;
  onGoToReview: () => void;
  onAddCustomPhoto?: (newPhoto: PhotoItem) => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
  totalLibraryCount,
  totalLibraryGB,
  reviewedCount,
  reviewedGB,
  keptSafeCount,
  toDeleteCount,
  toDeleteMB,
  onStartSprint,
  onGoToReview,
  onAddCustomPhoto,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const triggerAIScan = () => {
    setIsScanning(true);
    setScanMessage('Analyzing color histograms and burst groupings...');
    setTimeout(() => {
      setScanMessage('AI detected 14 blurry screenshots & 6 near-duplicate bursts!');
      setTimeout(() => {
        setIsScanning(false);
        setScanMessage(null);
      }, 2500);
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddCustomPhoto) {
      const url = URL.createObjectURL(file);
      const newPhoto: PhotoItem = {
        id: `user-${Date.now()}`,
        filename: file.name,
        url,
        sizeMB: +(file.size / (1024 * 1024)).toFixed(1) || 2.5,
        date: 'Today',
        category: 'general',
        categoryLabel: 'Imported Media',
        status: 'unreviewed',
        starred: false,
        aiInsight: {
          quality: 'sharp',
          recommendation: 'keep',
          reason: 'Newly added user photo from device storage.',
        },
        exif: {
          camera: 'Device Upload',
          lens: 'Standard',
          iso: 100,
          focal: '28mm',
          aperture: 'ƒ/2.0',
          dimensions: 'Original Resolution',
        },
      };
      onAddCustomPhoto(newPhoto);
      onStartSprint('general');
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Title & Stats */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Gallery</h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            {totalLibraryCount.toLocaleString()} photos • {totalLibraryGB.toFixed(1)} GB total
          </p>
        </div>

        {/* Live Sync Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-extrabold tracking-wider uppercase">LIVE SYNC</span>
        </div>
      </div>

      {/* Hero Card: Quick Clean Sprint (Matches Image 7 & 11) */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1c1f2e] to-[#14151b] border border-blue-500/20 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            RECOMMENDED
          </span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">Quick Clean Sprint</h3>
        <p className="text-xs text-zinc-300 mt-1 leading-snug">
          Clean 50 recent duplicates & blurry photos in 2 mins
        </p>

        {/* Progress bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="w-full bg-[#0e0f13] h-2 rounded-full overflow-hidden flex border border-white/5 p-[1px]">
            <div className="bg-[#10B981] h-full w-[45%] rounded-l-full" />
            <div className="bg-[#EF4444] h-full w-[25%]" />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
            <span className="uppercase tracking-wider text-[10px] text-zinc-400">Sprint Target</span>
            <span className="text-emerald-400 text-[10px] uppercase tracking-wider">50 items ready</span>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => onStartSprint(undefined, 50)}
          className="mt-3.5 w-full py-3 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          <span>Start Quick Sprint</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Stat Metric Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Library */}
        <div className="p-3.5 rounded-2xl bg-[#18181b] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              TOTAL LIBRARY
            </span>
            <ImageIcon className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-white">{totalLibraryCount.toLocaleString()}</span>
            <p className="text-[11px] text-zinc-400 mt-0.5">{totalLibraryGB.toFixed(1)} GB indexed</p>
          </div>
        </div>

        {/* Reviewed */}
        <div className="p-3.5 rounded-2xl bg-[#18181b] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              REVIEWED
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-white">{reviewedCount}</span>
            <p className="text-[11px] text-zinc-400 mt-0.5">{reviewedGB.toFixed(1)} GB scanned</p>
          </div>
        </div>

        {/* Kept Safe */}
        <div className="p-3.5 rounded-2xl bg-[#18181b] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              KEPT SAFE
            </span>
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-white">{keptSafeCount}</span>
            <p className="text-[11px] text-zinc-400 mt-0.5">Preserved items</p>
          </div>
        </div>

        {/* To Delete */}
        <div
          onClick={onGoToReview}
          className="p-3.5 rounded-2xl bg-[#18181b] border border-red-500/20 hover:border-red-500/40 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              TO DELETE
            </span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              READY
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
              {toDeleteCount}
            </span>
            <p className="text-[11px] text-red-400/90 mt-0.5 font-medium">
              {(toDeleteMB / 1024).toFixed(1)} GB to free
            </p>
          </div>
        </div>
      </div>

      {/* Albums & Categories Section */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">Albums & Categories</h2>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-blue-400">
            AUTO-SORTED
          </span>
        </div>

        <div className="space-y-2">
          {/* Screenshots Category */}
          <div className="p-3 rounded-2xl bg-[#18181b] border border-white/[0.08] flex items-center justify-between hover:bg-[#202024] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=150&q=80"
                  alt="Screenshots thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Screenshots</span>
                <span className="text-[11px] text-zinc-400">482 items • 1.8 GB</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartSprint('screenshots', 30)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 text-[11px] font-bold tracking-tight transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clean 482</span>
            </button>
          </div>

          {/* Duplicates Category */}
          <div
            onClick={() => onStartSprint('duplicates', 20)}
            className="p-3 rounded-2xl bg-[#18181b] border border-white/[0.08] flex items-center justify-between hover:bg-[#202024] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80"
                  alt="Duplicates thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Duplicates</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    HIGH PRIORITY
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">84 items • 720 MB</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Large Videos Category */}
          <div
            onClick={() => onStartSprint('videos', 10)}
            className="p-3 rounded-2xl bg-[#18181b] border border-white/[0.08] flex items-center justify-between hover:bg-[#202024] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80"
                  alt="Videos thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 text-[8px] font-extrabold bg-black/70 px-1 rounded text-white">
                  4K
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Large Videos</span>
                <span className="text-[11px] text-zinc-400">18 items • 5.6 GB</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* WhatsApp & Social */}
          <div
            onClick={() => onStartSprint('social', 25)}
            className="p-3 rounded-2xl bg-[#18181b] border border-white/[0.08] flex items-center justify-between hover:bg-[#202024] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80"
                  alt="Social thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">WhatsApp & Social</span>
                <span className="text-[11px] text-zinc-400">612 items • 3.4 GB</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Downloads & Bursts */}
          <div
            onClick={() => onStartSprint('bursts', 20)}
            className="p-3 rounded-2xl bg-[#18181b] border border-white/[0.08] flex items-center justify-between hover:bg-[#202024] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Bursts thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Downloads & Bursts</span>
                <span className="text-[11px] text-zinc-400">140 items • 940 MB</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Extra Added Feature: Smart Scanner & Custom Upload */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Smart Photo Tools</span>
          </div>
          <label className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold cursor-pointer hover:bg-blue-500/25 transition-all">
            <Upload className="w-3 h-3" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <button
          type="button"
          onClick={triggerAIScan}
          disabled={isScanning}
          className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Deep Scanning Library...' : 'Run Smart Clutter & Duplicate Scan'}</span>
        </button>

        {scanMessage && (
          <p className="text-[11px] text-emerald-400 text-center font-medium animate-pulse">
            {scanMessage}
          </p>
        )}
      </div>
    </div>
  );
};
