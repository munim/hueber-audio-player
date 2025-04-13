'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { getInitialStateFromURL, updateURLParams } from '@/lib/url-state';
import { AudioTrack } from '@/types';

interface FilterState {
  moduleId: string;
  bookType: 'KB' | 'AB' | 'all';
  lessonNumber: number | null;
  partNumber: number | null;
}

interface AudioContextProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  filters: FilterState;
  setCurrentTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
}

export const AudioContext = createContext<AudioContextProps>({} as AudioContextProps);

export function AudioStateProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(getInitialStateFromURL());
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    updateURLParams(filters);
  }, [filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      filters,
      setCurrentTrack,
      togglePlayPause,
      updateFilters,
    }}>
      {children}
    </AudioContext.Provider>
  );
}