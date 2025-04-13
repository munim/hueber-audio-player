import { AudioTrack } from '@/types';

let audioFilesCache: AudioTrack[] | null = null;

export async function discoverAudioFiles(): Promise<AudioTrack[]> {
  if (audioFilesCache) return audioFilesCache;
  
  try {
    const response = await fetch('/assets/audio-metadata.json');
    audioFilesCache = await response.json();
  } catch (error) {
    console.error('Failed to load audio metadata:', error);
    audioFilesCache = [];
  }
  
  return audioFilesCache || [];
}

export function parseAudioFilename(filename: string): Partial<AudioTrack> {
  const regex = /^(\d+)_(KB|AB)_L(\d+)_(\d+)\.mp3$/;
  const match = filename.match(regex);
  
  if (!match) return {};
  
  const [_, moduleId, bookType, lessonStr, partStr] = match;
  const lessonNumber = parseInt(lessonStr);
  const partNumber = parseInt(partStr);
  
  return {
    moduleId,
    bookType: bookType as 'KB' | 'AB',
    lessonNumber,
    partNumber,
    displayName: `Lesson ${lessonNumber} - Part ${partNumber}${bookType === 'AB' ? ' (Workbook)' : ''}`
  };
}