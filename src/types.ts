export interface PhotoItem {
  id: string;
  filename: string;
  url: string;
  sizeMB: number;
  date: string;
  category: 'screenshots' | 'duplicates' | 'videos' | 'social' | 'bursts' | 'general';
  categoryLabel?: string;
  burstGroup?: string;
  burstIndex?: number;
  burstTotal?: number;
  isDuplicate?: boolean;
  duplicateGroupId?: string;
  isRaw?: boolean;
  isVideo?: boolean;
  videoDuration?: string;
  starred?: boolean;
  status: 'unreviewed' | 'kept' | 'queued_for_deletion' | 'deleted';
  deletedAt?: number;
  aiInsight?: {
    quality: 'sharp' | 'blurry' | 'duplicate' | 'screenshot';
    recommendation: 'keep' | 'purge';
    reason: string;
    similarityScore?: number;
  };
  exif: {
    camera: string;
    lens: string;
    iso: number;
    focal: string;
    aperture: string;
    dimensions: string;
    location?: string;
  };
}

export type AppScreen = 'swipe' | 'gallery' | 'review' | 'settings';

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  swipeSensitivity: 'low' | 'medium' | 'high';
  swipeUpAction: 'favorite' | 'info' | 'skip';
  hapticFeedback: boolean;
  requireDeleteConfirmation: boolean;
  includeScreenshots: boolean;
  includeBursts: boolean;
  includeVideos: boolean;
  autoAdvance: boolean;
  soundEffects: boolean;
}

export interface BatchSession {
  name: string;
  categoryFilter?: string;
  totalInBatch: number;
  reviewedInBatch: number;
  targetCount: number;
  bytesPurgedMB: number;
}
