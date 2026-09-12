/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AppScreen, AppSettings, BatchSession, PhotoItem } from './types';
import { INITIAL_PHOTOS, INITIAL_DELETE_QUEUE } from './data/mockPhotos';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SwipeScreen } from './components/SwipeScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { HealthModal } from './components/HealthModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('swipe');

  // Photo State
  const [deck, setDeck] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [deleteQueue, setDeleteQueue] = useState<PhotoItem[]>(INITIAL_DELETE_QUEUE);
  const [keptSafeCount, setKeptSafeCount] = useState<number>(386);
  const [deletionHistory, setDeletionHistory] = useState<PhotoItem[]>([]);

  // Last action for Undo support
  const [lastAction, setLastAction] = useState<{
    type: 'purge' | 'keep' | 'star';
    photo: PhotoItem;
  } | null>({
    type: 'purge',
    photo: {
      id: 'p-4820',
      filename: 'IMG_4820.HEIC',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      sizeMB: 3.8,
      date: 'Oct 14, 2024',
      category: 'bursts',
      status: 'queued_for_deletion',
      exif: {
        camera: 'iPhone 15 Pro Max',
        lens: '24mm',
        iso: 160,
        focal: '24mm',
        aperture: 'ƒ/1.78',
        dimensions: '4032 × 3024',
      },
    },
  });

  // Batch Session state (Mirrors 24/150 reviewed & 92.4 MB purged from screenshot!)
  const [batchSession, setBatchSession] = useState<BatchSession>({
    name: 'SESSION BATCH',
    totalInBatch: 150,
    reviewedInBatch: 24,
    targetCount: 50,
    bytesPurgedMB: 92.4,
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    swipeSensitivity: 'medium',
    swipeUpAction: 'favorite',
    hapticFeedback: true,
    requireDeleteConfirmation: true,
    includeScreenshots: true,
    includeBursts: true,
    includeVideos: false,
    autoAdvance: true,
    soundEffects: true,
  });

  // Modals
  const [inspectedPhoto, setInspectedPhoto] = useState<PhotoItem | null>(null);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Compute stats
  const toDeleteMB = useMemo(() => {
    return deleteQueue.reduce((sum, p) => sum + p.sizeMB, 0);
  }, [deleteQueue]);

  const reviewedTotal = 420 + (batchSession.reviewedInBatch - 24);

  // Card Actions
  const handleKeepPhoto = (photo: PhotoItem) => {
    setKeptSafeCount((prev) => prev + 1);
    setLastAction({ type: 'keep', photo });
    setBatchSession((prev) => ({
      ...prev,
      reviewedInBatch: prev.reviewedInBatch + 1,
    }));
  };

  const handlePurgePhoto = (photo: PhotoItem) => {
    const updated = { ...photo, status: 'queued_for_deletion' as const };
    setDeleteQueue((prev) => [updated, ...prev]);
    setLastAction({ type: 'purge', photo });
    setBatchSession((prev) => ({
      ...prev,
      reviewedInBatch: prev.reviewedInBatch + 1,
      bytesPurgedMB: prev.bytesPurgedMB + photo.sizeMB,
    }));
  };

  const handleStarPhoto = (photo: PhotoItem) => {
    const starred = { ...photo, starred: true };
    setKeptSafeCount((prev) => prev + 1);
    setLastAction({ type: 'star', photo: starred });
    setBatchSession((prev) => ({
      ...prev,
      reviewedInBatch: prev.reviewedInBatch + 1,
    }));
  };

  const handleUndoLast = () => {
    if (!lastAction) return;

    if (lastAction.type === 'purge') {
      setDeleteQueue((prev) => prev.filter((p) => p.id !== lastAction.photo.id));
      setBatchSession((prev) => ({
        ...prev,
        reviewedInBatch: Math.max(0, prev.reviewedInBatch - 1),
        bytesPurgedMB: Math.max(0, +(prev.bytesPurgedMB - lastAction.photo.sizeMB).toFixed(1)),
      }));
    } else if (lastAction.type === 'keep' || lastAction.type === 'star') {
      setKeptSafeCount((prev) => Math.max(0, prev - 1));
      setBatchSession((prev) => ({
        ...prev,
        reviewedInBatch: Math.max(0, prev.reviewedInBatch - 1),
      }));
    }

    setLastAction(null);
  };

  // Sprint Trigger
  const handleStartSprint = (category?: string, targetCount = 50) => {
    let filtered = INITIAL_PHOTOS;
    let name = 'SESSION BATCH';

    if (category) {
      filtered = INITIAL_PHOTOS.filter((p) => p.category === category);
      if (filtered.length === 0) filtered = INITIAL_PHOTOS;
      name = `${category.toUpperCase()} BATCH`;
    }

    setDeck(filtered);
    setBatchSession({
      name,
      categoryFilter: category,
      totalInBatch: Math.max(filtered.length, targetCount),
      reviewedInBatch: 0,
      targetCount,
      bytesPurgedMB: 0,
    });
    setLastAction(null);
    setCurrentScreen('swipe');
  };

  const handlePermanentDelete = (photosToDelete: PhotoItem[]) => {
    const toDeleteIds = new Set(photosToDelete.map((p) => p.id));
    setDeleteQueue((prev) => prev.filter((p) => !toDeleteIds.has(p.id)));
    setDeletionHistory((prev) => [...photosToDelete, ...prev]);
  };

  const handleRestorePhoto = (photo: PhotoItem) => {
    setDeleteQueue((prev) => prev.filter((p) => p.id !== photo.id));
    setKeptSafeCount((prev) => prev + 1);
  };

  const handleRestoreAll = () => {
    setKeptSafeCount((prev) => prev + deleteQueue.length);
    setDeleteQueue([]);
  };

  const handleAddCustomPhoto = (newPhoto: PhotoItem) => {
    setDeck((prev) => [newPhoto, ...prev]);
  };

  const isLight = settings.theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#f4f4f5] text-[#18181b]' : 'bg-[#09090b] text-[#f4f4f5]'
      }`}
    >
      {/* Top Header */}
      <Header
        cleanPercent={84}
        onOpenHealth={() => setHealthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Primary Screen Area */}
      <main className="flex-1 flex flex-col overflow-y-auto relative pb-4">
        {currentScreen === 'swipe' && (
          <SwipeScreen
            photos={deck}
            currentBatch={batchSession}
            onKeepPhoto={handleKeepPhoto}
            onPurgePhoto={handlePurgePhoto}
            onStarPhoto={handleStarPhoto}
            onUndoLast={handleUndoLast}
            lastAction={lastAction}
            onOpenPhotoDetail={(photo) => setInspectedPhoto(photo)}
            onGoToReview={() => setCurrentScreen('review')}
            onResetSprint={() => handleStartSprint(batchSession.categoryFilter)}
          />
        )}

        {currentScreen === 'gallery' && (
          <GalleryScreen
            totalLibraryCount={2480}
            totalLibraryGB={18.4}
            reviewedCount={reviewedTotal}
            reviewedGB={3.1}
            keptSafeCount={keptSafeCount}
            toDeleteCount={deleteQueue.length}
            toDeleteMB={toDeleteMB}
            onStartSprint={handleStartSprint}
            onGoToReview={() => setCurrentScreen('review')}
            onAddCustomPhoto={handleAddCustomPhoto}
          />
        )}

        {currentScreen === 'review' && (
          <ReviewScreen
            queue={deleteQueue}
            onPermanentlyDelete={handlePermanentDelete}
            onRestorePhoto={handleRestorePhoto}
            onRestoreAll={handleRestoreAll}
            onOpenPhotoDetail={(photo) => setInspectedPhoto(photo)}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
            pendingQueueCount={deleteQueue.length}
            pendingQueueMB={toDeleteMB}
            onGoToReview={() => setCurrentScreen('review')}
            deletionHistory={deletionHistory}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Dock */}
      <BottomNav
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        deleteQueueCount={deleteQueue.length}
      />

      {/* Photo Inspection & EXIF Sheet Modal */}
      <PhotoDetailModal
        photo={inspectedPhoto}
        onClose={() => setInspectedPhoto(null)}
        onKeep={() => {
          if (inspectedPhoto) handleKeepPhoto(inspectedPhoto);
        }}
        onPurge={() => {
          if (inspectedPhoto) handlePurgePhoto(inspectedPhoto);
        }}
        onToggleStar={() => {
          if (inspectedPhoto) {
            setInspectedPhoto({ ...inspectedPhoto, starred: !inspectedPhoto.starred });
          }
        }}
      />

      {/* Clean Health Breakdown Modal */}
      <HealthModal
        isOpen={healthModalOpen}
        onClose={() => setHealthModalOpen(false)}
        cleanPercent={84}
        onStartSprint={() => {
          handleStartSprint();
          setCurrentScreen('swipe');
        }}
      />

      {/* User Profile & iCloud Sync Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
