'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { AudioContext } from './AudioStateProvider';
import { AudioTrack } from '../types';
import { getAudioFiles } from '../lib/audio-data';
import { Card, CardContent } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

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

  const groupedTracks = useMemo(() => {
    // First filter the tracks based on current filters
    const filtered = allTracks.filter(track => {
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

    // Then group by lesson number
    const groups: Record<number, AudioTrack[]> = {};
    filtered.forEach(track => {
      if (!groups[track.lessonNumber]) {
        groups[track.lessonNumber] = [];
      }
      groups[track.lessonNumber].push(track);
    });
    return groups;
  }, [allTracks, filters]);

  if (loading) {
    return <p className="text-center py-8 text-muted-foreground">Loading audio files...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {Object.keys(groupedTracks).length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No audio files match your filters</p>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={currentTrack ? [currentTrack.lessonNumber.toString()] : []}
          className="space-y-2"
        >
          {Object.entries(groupedTracks)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([lessonNumber, tracks]) => (
              <AccordionItem
                key={lessonNumber}
                value={lessonNumber}
                className="border-b-0"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-2 bg-muted/50 rounded-md hover:bg-muted/80 transition-colors">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      Lesson {lessonNumber} ({tracks.length} part{tracks.length > 1 ? 's' : ''})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-2">
                    {tracks.map(track => (
                      <Card
                        key={track.id}
                        className={`cursor-pointer hover:bg-accent transition-colors ${
                          currentTrack?.id === track.id ? 'border-primary bg-accent' : ''
                        }`}
                        onClick={() => setCurrentTrack(track)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">
                              Part {track.partNumber} - {track.bookType === 'KB' ? 'Course Book' : 'Workbook'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Module {track.moduleNumber} - {track.band}
                            </p>
                          </div>
                          {currentTrack?.id === track.id && (
                            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
}