import React, { useState } from 'react';
import { PhotoItem } from '../types';
import { soundFx } from '../utils/audio';
import {
  Trash2,
  ShieldCheck,
  Check,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface ReviewScreenProps {
  queue: PhotoItem[];
  onPermanentlyDelete: (photosToDelete: PhotoItem[]) => void;
  onRestorePhoto: (photo: PhotoItem) => void;
  onRestoreAll: () => void;
  onOpenPhotoDetail: (photo: PhotoItem) => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  queue,
  onPermanentlyDelete,
  onRestorePhoto,
  onRestoreAll,
  onOpenPhotoDetail,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(queue.map((p) => p.id))
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'duplicates' | 'blurry'>('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Sync selectedIds if queue changes
  React.useEffect(() => {
    setSelectedIds(new Set(queue.map((p) => p.id)));
  }, [queue]);

  const toggleSelect = (id: string, photo: PhotoItem) => {
    soundFx.triggerHaptic('light');
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Automatically restore back to library if unselected
        onRestorePhoto(photo);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredQueue = queue.filter((p) => {
    if (activeFilter === 'duplicates') return p.isDuplicate || p.category === 'duplicates';
    if (activeFilter === 'blurry') return p.aiInsight?.quality === 'blurry' || p.category === 'screenshots';
    return true;
  });

  const selectedPhotos = queue.filter((p) => selectedIds.has(p.id));
  const selectedSizeMB = selectedPhotos.reduce((acc, p) => acc + p.sizeMB, 0);

  const handlePermanentDelete = () => {
    soundFx.playPermanentDeleteSound();
    soundFx.triggerHaptic('heavy');
    onPermanentlyDelete(selectedPhotos);
    setShowConfirmModal(false);
  };

  return (
    <div className="flex flex-col flex-1 max-w-md mx-auto px-4 pt-3 pb-28">
      {/* Header (Matches Image 4) */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Review Before Deleting</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tap any thumbnail to unselect & keep it safe
          </p>
        </div>

        {queue.length > 0 && (
          <button
            type="button"
            onClick={onRestoreAll}
            className="text-[11px] font-bold text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore All</span>
          </button>
        )}
      </div>

      {/* Safe Review Mode Banner (Matches Image 4) */}
      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 mb-3.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-300/90 leading-relaxed font-medium">
          <strong className="text-emerald-400 font-semibold">Safe Review Mode:</strong> No photos are deleted until you confirm below. Tap any photo to unselect and return it to your gallery.
        </p>
      </div>

      {/* Filter Tabs (Enclosed in Frosted Glass Box) */}
      <div className="p-1 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/15 shadow-md flex items-center gap-1.5 mb-3.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          All ({queue.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('duplicates')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'duplicates'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          Duplicates ({queue.filter((p) => p.isDuplicate || p.category === 'duplicates').length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('blurry')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'blurry'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          Blurry & Clutter ({queue.filter((p) => p.aiInsight?.quality === 'blurry' || p.category === 'screenshots').length})
        </button>
      </div>

      {/* Grid of Queued Photos (Matches Image 4) */}
      {filteredQueue.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 flex-1 auto-rows-fr">
          {filteredQueue.map((photo) => {
            const isSelected = selectedIds.has(photo.id);

            return (
              <div
                key={photo.id}
                onClick={() => toggleSelect(photo.id, photo)}
                className={`group relative rounded-2xl overflow-hidden aspect-square border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-red-500/80 ring-2 ring-red-500/30'
                    : 'border-white/10 opacity-50 grayscale'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Top Right Status Badge */}
                <div className="absolute top-2 right-2 z-10">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#ef4444] text-white flex items-center justify-center shadow-lg border border-white/20">
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 border border-white/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Info button top left */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPhotoDetail(photo);
                  }}
                  className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/60 text-zinc-300 flex items-center justify-center text-[10px] hover:text-white transition-colors"
                >
                  <Info className="w-3 h-3" />
                </button>

                {/* Bottom Metadata */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] font-semibold text-zinc-300">
                  <span className="truncate">{photo.sizeMB} MB</span>
                  <span className="text-zinc-400 text-[9px] truncate">{photo.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Queue State */
        <div className="flex flex-col items-center justify-center py-16 text-center bg-[#18181b]/50 rounded-3xl border border-white/5 my-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Photos In Queue</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
            Your deletion queue is empty. Swipe left on photos in the deck to flag them for deletion!
          </p>
        </div>
      )}

      {/* Bottom Sticky Action Bar (Enclosed in Frosted Glass Box) */}
      {queue.length > 0 && (
        <div className="fixed bottom-[74px] left-0 right-0 z-30 px-4">
          <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-zinc-900/70 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] ring-1 ring-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                {selectedPhotos.length} Photos Selected
              </span>
              <span className="text-[11px] font-semibold text-red-400">
                {(selectedSizeMB / 1024).toFixed(2)} GB ready to reclaim
              </span>
            </div>

            <button
              type="button"
              disabled={selectedPhotos.length === 0}
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 rounded-full bg-[#ef4444] hover:bg-red-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95 border border-red-400/40"
            >
              <Trash2 className="w-4 h-4" />
              <span>Review Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Dialog (Exact match of Image 5!) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-[#18181b] border-t border-white/10 rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Drag Handle */}
            <div className="w-10 h-1 rounded-full bg-zinc-600 mx-auto mb-6" />

            {/* Trash Icon Node */}
            <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#ef4444] mx-auto mb-4 shadow-lg shadow-red-500/10">
              <Trash2 className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-white text-center tracking-tight">
              Delete {selectedPhotos.length} Photos?
            </h2>

            {/* Description */}
            <p className="text-xs text-zinc-400 text-center mt-2 max-w-[300px] mx-auto leading-relaxed">
              These items will be permanently deleted from your iCloud/Device photo library. This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={handlePermanentDelete}
                className="w-full py-3.5 rounded-full bg-[#ef4444] hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-500/30 transition-all cursor-pointer active:scale-[0.99]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Permanently Delete</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel & Keep In Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
