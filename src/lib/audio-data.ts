import { AudioTrack } from '@/types';

let audioFilesCache: AudioTrack[] | null = null;

export function discoverAudioFiles(): AudioTrack[] {
  if (audioFilesCache) return audioFilesCache;
  
  // In production, this would load from a generated JSON file
  // For now, we'll use static test data
  audioFilesCache = [
    {
      id: '6001083-KB-8-10',
      moduleId: '6001083',
      bookType: 'KB',
      lessonNumber: 8,
      partNumber: 10,
      filePath: '/assets/audio/6001083/6001083_KB_L08_10.mp3',
      displayName: 'Lesson 8 - Part 10'
    },
    {
      id: '6001083-KB-8-11',
      moduleId: '6001083',
      bookType: 'KB',
      lessonNumber: 8,
      partNumber: 11,
      filePath: '/assets/audio/6001083/6001083_KB_L08_11.mp3',
      displayName: 'Lesson 8 - Part 11'
    },
    {
      id: '6001083-AB-8-1',
      moduleId: '6001083',
      bookType: 'AB',
      lessonNumber: 8,
      partNumber: 1,
      filePath: '/assets/audio/6001083/6001083_AB_L08_01.mp3',
      displayName: 'Lesson 8 - Part 1 (Workbook)'
    }
  ];
  
  return audioFilesCache;
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