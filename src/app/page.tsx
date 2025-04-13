'use client';

import { AudioStateProvider } from '../components/AudioStateProvider';
import FilterControls from '../components/FilterControls';
import TrackList from '../components/TrackList';
import AudioPlayer from '../components/AudioPlayer';

export default function Home() {
  return (
    <AudioStateProvider>
      <div className="flex flex-col min-h-screen p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Schritte Plus Neu Audio Player</h1>
        
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