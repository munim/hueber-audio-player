export interface AudioTrack {
  id: string;
  moduleId: string;
  bookType: 'KB' | 'AB';
  lessonNumber: number;
  partNumber: number;
  filePath: string;
  displayName: string;
}

export interface FilterState {
  moduleId: string;
  bookType: 'KB' | 'AB';
  lessonNumber: number | null;
  partNumber: number | null;
}

export interface AudioContextProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  filters: FilterState;
  setCurrentTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
}