import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { PhotoItem, BatchSession } from '../types';
import { soundFx } from '../utils/audio';
import {
  RotateCcw,
  Trash2,
  Star,
  Heart,
  Info,
  Share2,
  Layers,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface SwipeScreenProps {
  photos: PhotoItem[];
  currentBatch: BatchSession;
  onKeepPhoto: (photo: PhotoItem) => void;
  onPurgePhoto: (photo: PhotoItem) => void;
  onStarPhoto: (photo: PhotoItem) => void;
  onUndoLast: () => void;
  lastAction: { type: 'purge' | 'keep' | 'star'; photo: PhotoItem } | null;
  onOpenPhotoDetail: (photo: PhotoItem) => void;
  onGoToReview: () => void;
  onResetSprint: () => void;
}

export const SwipeScreen: React.FC<SwipeScreenProps> = ({
  photos,
  currentBatch,
  onKeepPhoto,
  onPurgePhoto,
  onStarPhoto,
  onUndoLast,
  lastAction,
  onOpenPhotoDetail,
  onGoToReview,
  onResetSprint,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Active photo
  const activePhoto = photos[currentIndex] || null;
  const nextPhoto = photos[currentIndex + 1] || null;

  // Motion values for gesture physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic transforms based on drag translation
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const purgeOpacity = useTransform(x, [-160, -30], [1, 0]);
  const keepOpacity = useTransform(x, [30, 160], [0, 1]);
  const starOpacity = useTransform(y, [-160, -30], [1, 0]);

  // Ambient glows behind active card
  const glowCoral = useTransform(x, [-200, 0], [0.35, 0]);
  const glowMint = useTransform(x, [0, 200], [0, 0.35]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    const thresholdX = 100;
    const thresholdY = 120;

    if (info.offset.x < -thresholdX && activePhoto) {
      // Swipe left -> Purge
      triggerPurge(activePhoto);
    } else if (info.offset.x > thresholdX && activePhoto) {
      // Swipe right -> Keep
      triggerKeep(activePhoto);
    } else if (info.offset.y < -thresholdY && activePhoto) {
      // Swipe up -> Star
      triggerStar(activePhoto);
    }
  };

  const triggerPurge = (photo: PhotoItem) => {
    soundFx.playPurgeSound();
    soundFx.triggerHaptic('medium');
    onPurgePhoto(photo);
    setCurrentIndex((prev) => prev + 1);
  };

  const triggerKeep = (photo: PhotoItem) => {
    soundFx.playKeepSound();
    soundFx.triggerHaptic('light');
    onKeepPhoto(photo);
    setCurrentIndex((prev) => prev + 1);
  };

  const triggerStar = (photo: PhotoItem) => {
    soundFx.playStarSound();
    soundFx.triggerHaptic('medium');
    onStarPhoto(photo);
    setCurrentIndex((prev) => prev + 1);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === 'ArrowLeft') {
        triggerPurge(activePhoto);
      } else if (e.key === 'ArrowRight') {
        triggerKeep(activePhoto);
      } else if (e.key === 'ArrowUp') {
        triggerStar(activePhoto);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (lastAction) {
          soundFx.playUndoSound();
          onUndoLast();
          if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto, currentIndex, lastAction]);

  const handleShare = () => {
    if (!activePhoto) return;
    if (navigator.share) {
      navigator.share({
        title: activePhoto.filename,
        text: `Photo from Gallrize - ${activePhoto.filename}`,
        url: activePhoto.url,
      }).catch(() => {});
    } else {
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-60px-70px)] max-w-md mx-auto px-4 pt-2 pb-2 justify-between select-none">
      {/* Top Status & Progress Bar (Session Batch) */}
      <div className="w-full mb-2">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="tracking-wider uppercase text-[11px] font-bold text-zinc-200">
              {currentBatch.name || 'SESSION BATCH'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
              {Math.min(currentBatch.reviewedInBatch + currentIndex, currentBatch.totalInBatch)} / {currentBatch.totalInBatch} REVIEWED
            </span>
          </div>
        </div>

        {/* Progress Bar with Dual-segment indicator */}
        <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden flex border border-white/[0.06] p-[1px]">
          <div
            className="bg-[#10B981] h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, ((currentBatch.reviewedInBatch + currentIndex) / Math.max(1, currentBatch.totalInBatch)) * 100)}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] mt-1.5 text-zinc-400 font-medium px-0.5">
          <span className="text-[#ef4444] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
            {currentBatch.bytesPurgedMB.toFixed(1)} MB TO PURGE
          </span>
          <span className="text-zinc-500">
            {Math.max(0, currentBatch.totalInBatch - (currentBatch.reviewedInBatch + currentIndex))} REMAINING
          </span>
        </div>
      </div>

      {/* Main Interactive Gesture Arena */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto min-h-[360px] max-h-[480px]">
        {activePhoto ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background ambient glow according to gesture */}
            <motion.div
              className="absolute inset-0 rounded-[28px] bg-red-500 blur-2xl pointer-events-none -z-10"
              style={{ opacity: glowCoral }}
            />
            <motion.div
              className="absolute inset-0 rounded-[28px] bg-emerald-500 blur-2xl pointer-events-none -z-10"
              style={{ opacity: glowMint }}
            />

            {/* Next Card underneath (gives the tactile stacked card depth) */}
            {nextPhoto && (
              <div
                className="absolute inset-x-2 inset-y-1 rounded-[28px] overflow-hidden bg-[#18181b] border border-white/[0.08] shadow-xl pointer-events-none transition-transform"
                style={{
                  transform: 'scale(0.94) translateY(12px)',
                  opacity: 0.6,
                  filter: 'brightness(0.7)',
                }}
              >
                <img
                  src={nextPhoto.url}
                  alt={nextPhoto.filename}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Active Card with Gesture Physics */}
            <motion.div
              className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#18181b] border border-white/[0.12] shadow-2xl cursor-grab active:cursor-grabbing touch-none select-none group"
              style={{
                x,
                y,
                rotate,
              }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              whileTap={{ scale: 0.99 }}
            >
              {/* Photo Image */}
              <img
                src={activePhoto.url}
                alt={activePhoto.filename}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />

              {/* Gradient Scrims for text contrast */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Tilted Stamp Badges (Visible during swipe gesture) */}
              <motion.div
                style={{ opacity: purgeOpacity }}
                className="absolute top-6 left-6 -rotate-12 px-4 py-1.5 rounded-xl bg-[#ef4444] text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-red-600/40 border-2 border-white/20 flex items-center gap-1.5 pointer-events-none z-20"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>PURGE</span>
              </motion.div>

              <motion.div
                style={{ opacity: keepOpacity }}
                className="absolute top-6 right-6 rotate-12 px-4 py-1.5 rounded-xl bg-[#10b981] text-black font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/40 border-2 border-white/30 flex items-center gap-1.5 pointer-events-none z-20"
              >
                <Heart className="w-4 h-4 fill-black stroke-black" />
                <span>KEEP</span>
              </motion.div>

              <motion.div
                style={{ opacity: starOpacity }}
                className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-[#f59e0b] text-black font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-amber-500/40 border-2 border-white/30 flex items-center gap-1.5 pointer-events-none z-20"
              >
                <Star className="w-4 h-4 fill-black stroke-black" />
                <span>FAVORITE</span>
              </motion.div>

              {/* Right Edge Tactical Floating Controls (Enclosed in Frosted Glass Box) */}
              <div className="absolute right-3 bottom-20 flex flex-col items-center gap-2 z-20 p-1.5 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] ring-1 ring-white/10">
                {/* Info Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPhotoDetail(activePhoto);
                  }}
                  className="w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-white hover:bg-white/[0.18] hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  title="Photo Details & EXIF"
                >
                  <Info className="w-4 h-4" />
                  <span className="text-[8px] font-bold mt-0.5 tracking-tight uppercase">INFO</span>
                </button>

                {/* Star Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerStar(activePhoto);
                  }}
                  className={`w-10 h-10 rounded-full backdrop-blur-xl border flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer ${
                    activePhoto.starred
                      ? 'bg-amber-500/80 border-amber-300 text-white shadow-amber-500/30'
                      : 'bg-white/[0.08] border-white/20 text-white hover:bg-white/[0.18]'
                  }`}
                  title="Favorite & Keep"
                >
                  <Star className={`w-4 h-4 ${activePhoto.starred ? 'fill-white' : ''}`} />
                  <span className="text-[8px] font-bold mt-0.5 tracking-tight uppercase">STAR</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-white hover:bg-white/[0.18] hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  title="Share Photo"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[8px] font-bold mt-0.5 tracking-tight uppercase">SHARE</span>
                </button>

                {/* Person Face detection thumbnail avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 shadow-lg mt-0.5">
                  <img
                    src={activePhoto.url}
                    alt="Face detection"
                    className="w-full h-full object-cover object-top scale-150"
                  />
                </div>
              </div>

              {/* Bottom Card Metadata Chips (Matches Image 3 & 13) */}
              <div className="absolute left-3 bottom-3 right-16 z-20 flex flex-col gap-1.5">
                {/* AI Advice Pill (Our added feature!) */}
                {activePhoto.aiInsight && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-zinc-200 self-start shadow-md">
                    <Sparkles className="w-3 h-3 text-[#10b981]" />
                    <span className="truncate max-w-[220px]">
                      {activePhoto.aiInsight.reason}
                    </span>
                  </div>
                )}

                {/* Primary Metadata Pill Box */}
                <div className="p-2.5 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/15 shadow-xl flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {activePhoto.filename}
                    </span>
                    {activePhoto.isRaw && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                        RAW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium">
                    <span className="text-zinc-200 font-semibold">{activePhoto.sizeMB} MB</span>
                    <span className="text-zinc-500">•</span>
                    <span>{activePhoto.date}</span>
                    {activePhoto.burstTotal && (
                      <>
                        <span className="text-zinc-500">•</span>
                        <span className="flex items-center gap-1 text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          <Layers className="w-2.5 h-2.5" />
                          {activePhoto.burstIndex} of {activePhoto.burstTotal} Burst
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Victory / Empty Sprint State */
          <div className="w-full flex flex-col items-center justify-center p-6 text-center bg-[#18181b]/80 border border-white/10 rounded-[28px] backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] mb-3 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-white">Sprint Completed!</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-[260px]">
              You evaluated all photos in this batch. Ready to purge queued photos or start a fresh sprint?
            </p>
            <div className="flex flex-col gap-2 w-full mt-5">
              <button
                type="button"
                onClick={onGoToReview}
                className="w-full py-3 rounded-full bg-[#ef4444] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Review & Empty Trash</span>
              </button>
              <button
                type="button"
                onClick={onResetSprint}
                className="w-full py-2.5 rounded-full bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-white/15 transition-colors border border-white/10 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Next Clean Sprint</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tactical Action Dock (Enclosed in Frosted Glass Pod Box) */}
      <div className="flex items-center justify-center my-1.5 px-2">
        <div className="flex items-center justify-center gap-3 sm:gap-3.5 px-4 py-2.5 rounded-full bg-zinc-900/60 backdrop-blur-2xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.22)] ring-1 ring-white/10">
          {/* Undo Button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playUndoSound();
              soundFx.triggerHaptic('light');
              onUndoLast();
              if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
            }}
            disabled={!lastAction}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              lastAction
                ? 'bg-white/[0.08] text-zinc-100 border border-white/20 hover:bg-white/[0.18] hover:border-white/30 active:scale-90 shadow-md backdrop-blur-md'
                : 'bg-white/[0.03] text-zinc-600 border border-white/5 cursor-not-allowed opacity-40'
            }`}
            title="Undo Last Action (⌘Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Purge / Delete Button (Coral Glass Action) */}
          <button
            type="button"
            disabled={!activePhoto}
            onClick={() => activePhoto && triggerPurge(activePhoto)}
            className="w-14 h-14 rounded-full bg-red-500/15 backdrop-blur-xl border border-red-500/40 text-[#ef4444] flex items-center justify-center hover:bg-red-500/25 hover:border-red-400 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] cursor-pointer disabled:opacity-40"
            title="Purge / Delete (← Left Arrow)"
          >
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Star / Favorite Button (Amber Glass Action) */}
          <button
            type="button"
            disabled={!activePhoto}
            onClick={() => activePhoto && triggerStar(activePhoto)}
            className="w-12 h-12 rounded-full bg-amber-500/15 backdrop-blur-xl border border-amber-500/40 text-[#f59e0b] flex items-center justify-center hover:bg-amber-500/25 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] cursor-pointer disabled:opacity-40"
            title="Star & Keep (↑ Up Arrow)"
          >
            <Star className="w-5 h-5 fill-amber-500/30 stroke-[2.2]" />
          </button>

          {/* Keep Button (Vibrant Mint Emerald Glass Action) */}
          <button
            type="button"
            disabled={!activePhoto}
            onClick={() => activePhoto && triggerKeep(activePhoto)}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] text-black flex items-center justify-center hover:from-[#34d399] hover:to-[#10b981] hover:scale-105 active:scale-95 transition-all shadow-[0_6px_28px_rgba(16,185,129,0.45),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-emerald-300/40 cursor-pointer disabled:opacity-40"
            title="Keep Photo (→ Right Arrow)"
          >
            <Heart className="w-7 h-7 fill-white stroke-white stroke-[2.2]" />
          </button>

          {/* Info Button */}
          <button
            type="button"
            disabled={!activePhoto}
            onClick={() => activePhoto && onOpenPhotoDetail(activePhoto)}
            className="w-11 h-11 rounded-full bg-white/[0.08] text-zinc-100 border border-white/20 hover:bg-white/[0.18] hover:border-white/30 active:scale-90 transition-all flex items-center justify-center shadow-md backdrop-blur-md cursor-pointer disabled:opacity-40"
            title="Inspect Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Undo Snackbar (Enclosed in Frosted Glass Border Box) */}
      <div className="h-9 flex items-center justify-center px-2">
        {lastAction ? (
          <div className="w-full max-w-sm px-4 py-1.5 rounded-full bg-zinc-900/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] ring-1 ring-white/10 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 truncate text-xs">
              <span className={`w-2 h-2 rounded-full ${lastAction.type === 'purge' ? 'bg-[#ef4444]' : lastAction.type === 'keep' ? 'bg-[#10b981]' : 'bg-[#f59e0b]'}`}></span>
              <span className="text-zinc-200 truncate">
                {lastAction.type === 'purge' ? 'Purged' : lastAction.type === 'keep' ? 'Kept' : 'Favorited'} {lastAction.photo.filename}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-[#ef4444] font-semibold">{lastAction.photo.sizeMB} MB</span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playUndoSound();
                onUndoLast();
                if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
              }}
              className="text-xs font-bold text-[#93c5fd] hover:text-white flex items-center gap-1 ml-2 cursor-pointer uppercase tracking-wider shrink-0"
            >
              <span>UNDO</span>
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
            <span>Swipe Left to Purge</span>
            <span>•</span>
            <span>Swipe Right to Keep</span>
          </div>
        )}
      </div>

      {/* Share Toast */}
      {shareFeedback && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-800 text-white text-xs font-medium border border-white/20 shadow-xl z-50">
          Photo link copied to clipboard!
        </div>
      )}
    </div>
  );
};
