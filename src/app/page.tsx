'use client';

import { AudioStateProvider } from '../components/AudioStateProvider';
import FilterControls from '../components/FilterControls';
import TrackList from '../components/TrackList';
import AudioPlayer from '../components/AudioPlayer';
import { ThemeToggle } from '../components/ui/theme-toggle';

export default function Home() {
  return (
    <AudioStateProvider>
      <div className="flex flex-col min-h-screen p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Schritte Plus Neu Audio Player</h1>
          <ThemeToggle />
        </div>
        
        <FilterControls />
        
        <div className="flex-grow my-6">
          <TrackList />
        </div>
        
        <div className="sticky bottom-0 bg-card p-4 rounded-t-lg shadow-lg border-t">
          <AudioPlayer />
        </div>
      </div>
    </AudioStateProvider>
  );
}