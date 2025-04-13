import { AudioTrack } from '@/types';

let audioFilesCache: AudioTrack[] | null = null;
let fetchPromise: Promise<AudioTrack[]> | null = null;

export async function getAudioFiles(): Promise<AudioTrack[]> {
  // Return cached data if available
  if (audioFilesCache) return audioFilesCache;
  
  // Return existing promise if fetch is in progress
  if (fetchPromise) return fetchPromise;

  try {
    fetchPromise = fetch('/assets/audio-metadata.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch audio metadata');
        return response.json();
      })
      .then(data => {
        audioFilesCache = data;
        return data;
      })
      .catch(error => {
        console.error('Failed to load audio metadata:', error);
        return [];
      })
      .finally(() => {
        fetchPromise = null;
      });

    return await fetchPromise;
  } catch (error) {
    console.error('Error fetching audio files:', error);
    return [];
  }
}

// Utility function to get audio file URL
export function getAudioFileUrl(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}