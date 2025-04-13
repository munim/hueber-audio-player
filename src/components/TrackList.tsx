'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { AudioContext } from './AudioStateProvider';
import { AudioTrack } from '../types';
import { getAudioFiles } from '../lib/audio-data';
import { Card, CardContent } from './ui/card';

export default function TrackList() {
  const { filters, currentTrack, setCurrentTrack } = useContext(AudioContext);
  const [allTracks, setAllTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const tracks = await getAudioFiles();
        setAllTracks(tracks);
      } catch (err) {
        setError('Failed to load audio tracks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTracks();
  }, []);

  const filteredTracks = useMemo(() => {
    return allTracks.filter(track => {
      if (filters.moduleId && track.moduleId !== filters.moduleId) return false;
      if (filters.bookType && track.bookType !== filters.bookType) return false;
      if (filters.lessonNumber && track.lessonNumber !== filters.lessonNumber) return false;
      if (filters.partNumber && track.partNumber !== filters.partNumber) return false;
      return true;
    }).sort((a, b) => {
      if (a.lessonNumber !== b.lessonNumber) {
        return a.lessonNumber - b.lessonNumber;
      }
      return a.partNumber - b.partNumber;
    });
  }, [allTracks, filters]);

  if (loading) {
    return <p className="text-center py-8 text-muted-foreground">Loading audio files...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-2">
      {filteredTracks.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No audio files match your filters</p>
      ) : (
        filteredTracks.map(track => (
          <Card
            key={track.id}
            className={`cursor-pointer hover:bg-accent transition-colors ${
              currentTrack?.id === track.id ? 'border-primary' : ''
            }`}
            onClick={() => setCurrentTrack(track)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{track.displayName}</h3>
                <p className="text-sm text-muted-foreground">
                  Module {track.moduleNumber} - {track.band} - {track.bookType === 'KB' ? 'Course Book' : 'Workbook'}
                </p>
              </div>
              {currentTrack?.id === track.id && (
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}