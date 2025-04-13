'use client';

import { AudioStateProvider } from '../components/AudioStateProvider';
import FilterControls from '../components/FilterControls';
import TrackList from '../components/TrackList';
import AudioPlayer from '../components/AudioPlayer';
import { ThemeToggle } from '../components/ui/theme-toggle';
import About from '../components/About';

export default function Home() {
  return (
    <AudioStateProvider>
      <div className="flex flex-col min-h-screen p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Schritte Plus Neu Audio Player</h1>
          <div className="flex items-center gap-2">
            <About />
            <ThemeToggle />
          </div>
        </div>
        
        <FilterControls />
        
        <div className="flex-grow my-6 pb-24">
          <TrackList />
        </div>
        
        <AudioPlayer />
      </div>
    </AudioStateProvider>
  );
}