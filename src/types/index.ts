export type BookType = 'KB' | 'AB' | 'all';

export const BOOK_TYPES: Record<BookType, string> = {
  KB: 'Course Book',
  AB: 'Workbook',
  all: 'All'
};

export interface AudioTrack {
  id: string;
  moduleId: string;
  moduleNumber: string;
  band: string;
  bookType: BookType;
  lessonNumber: number;
  partNumber: number;
  filePath: string;
  displayName: string;
};

export interface FilterState {
  moduleId: string;
  bookType: BookType;
  lessonNumber: number | null;
  partNumber: number | null;
};

export interface AudioContextProps {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  filters: FilterState;
  setCurrentTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
};

export type AudioMetadataResponse = {
  success: boolean;
  data?: AudioTrack[];
  error?: string;
  timestamp?: string;
};