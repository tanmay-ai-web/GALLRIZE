import React from 'react';
import { PhotoItem } from '../types';
import { X, Camera, Aperture, MapPin, Sparkles, Heart, Trash2, HardDrive, Maximize2 } from 'lucide-react';

interface PhotoDetailModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onKeep?: () => void;
  onPurge?: () => void;
  onToggleStar?: () => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
  onKeep,
  onPurge,
  onToggleStar,
}) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm font-bold text-white truncate">{photo.filename}</span>
            {photo.isRaw && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                RAW
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          {/* Photo Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black/40 aspect-[4/3] flex items-center justify-center border border-white/5">
            <img
              src={photo.url}
              alt={photo.filename}
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-2 right-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-white/80 backdrop-blur-md">
              {photo.sizeMB} MB
            </span>
          </div>

          {/* AI Analysis Card */}
          {photo.aiInsight && (
            <div className="p-3.5 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/25 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                    AI Smart Triage
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-semibold">
                    {photo.aiInsight.recommendation === 'keep' ? 'Recommended: Keep' : 'Recommended: Purge'}
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  {photo.aiInsight.reason}
                </p>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Device</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{photo.exif.camera}</p>
              <p className="text-[11px] text-zinc-400 truncate">{photo.exif.lens}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Aperture className="w-3.5 h-3.5" />
                <span>Exposure</span>
              </div>
              <p className="text-xs font-semibold text-white">
                {photo.exif.aperture} • ISO {photo.exif.iso}
              </p>
              <p className="text-[11px] text-zinc-400">{photo.exif.focal}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Dimensions</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{photo.exif.dimensions}</p>
              <p className="text-[11px] text-zinc-400">{photo.date}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">
                {photo.exif.location || 'Local Device'}
              </p>
              <p className="text-[11px] text-zinc-400">{photo.categoryLabel || photo.category}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions (Enclosed in Frosted Glass Box) */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between gap-3 bg-zinc-950/80 backdrop-blur-2xl">
          <button
            onClick={() => {
              if (onToggleStar) onToggleStar();
            }}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border transition-all text-xs font-semibold cursor-pointer ${
              photo.starred
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-white/[0.06] text-zinc-300 border-white/15 hover:bg-white/[0.12]'
            }`}
          >
            <Heart className={`w-4 h-4 ${photo.starred ? 'fill-amber-400' : ''}`} />
            <span>{photo.starred ? 'Favorited' : 'Favorite'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onPurge) onPurge();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge</span>
            </button>

            <button
              onClick={() => {
                if (onKeep) onKeep();
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#10b981] text-black font-bold text-xs hover:bg-[#059669] transition-all shadow-lg shadow-emerald-500/30 border border-emerald-300/40 cursor-pointer"
            >
              <span>Keep Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
