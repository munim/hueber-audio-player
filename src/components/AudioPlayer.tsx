'use client';

import { useContext, useRef, useEffect, useState } from 'react';
import { AudioContext } from './AudioStateProvider';
import { Button } from './ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Repeat, Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, togglePlayPause } = useContext(AudioContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isRepeat, setIsRepeat] = useState(false);
  
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.filePath;
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (newValue: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue[0];
      setProgress(newValue[0]);
    }
  };

  const handleRepeatToggle = () => {
    setIsRepeat(!isRepeat);
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        Select an audio track to play
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (!isRepeat) togglePlayPause();
        }}
      />
      
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{currentTrack.displayName}</h3>
        <p className="text-sm text-muted-foreground">
          {formatTime(progress)} / {formatTime(duration)}
        </p>
      </div>
      
      <Slider 
        value={[progress]} 
        max={duration || 100}
        step={0.1}
        onValueChange={handleSeek}
        className="w-full"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <Button
            size="icon"
            variant={isRepeat ? "default" : "outline"}
            onClick={handleRepeatToggle}
          >
            <Repeat size={20} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <Slider 
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(values: number[]) => setVolume(values[0] / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}