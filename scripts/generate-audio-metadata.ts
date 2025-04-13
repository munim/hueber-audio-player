import type { AudioTrack } from '../src/types';
const path = require('path');
const fs = require('fs');

function parseAudioFilename(filename: string): Partial<AudioTrack> {
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

function scanAudioFiles(): AudioTrack[] {
  const audioDir = path.join(process.cwd(), 'public', 'assets', 'audio');
  const tracks: AudioTrack[] = [];
  
  if (!fs.existsSync(audioDir)) {
    return [];
  }

  const moduleDirs = fs.readdirSync(audioDir);
  
  for (const moduleId of moduleDirs) {
    const moduleDir = path.join(audioDir, moduleId);
    const files = fs.readdirSync(moduleDir);
    
    for (const file of files) {
      const parsed = parseAudioFilename(file);
      if (parsed.moduleId) {
        tracks.push({
          id: `${moduleId}-${parsed.bookType}-${parsed.lessonNumber}-${parsed.partNumber}`,
          moduleId,
          bookType: parsed.bookType!,
          lessonNumber: parsed.lessonNumber!,
          partNumber: parsed.partNumber!,
          filePath: `/assets/audio/${moduleId}/${file}`,
          displayName: parsed.displayName!
        });
      }
    }
  }
  
  return tracks;
}

// Generate and save audio metadata
const tracks = scanAudioFiles();
const outputPath = path.join(process.cwd(), 'public', 'assets', 'audio-metadata.json');

fs.writeFileSync(outputPath, JSON.stringify(tracks, null, 2));
console.log(`Generated audio metadata with ${tracks.length} tracks`);