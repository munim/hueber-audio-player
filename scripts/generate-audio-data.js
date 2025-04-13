const path = require('path');
const fs = require('fs');

function parseAudioFilename(filename) {
  const regex = /^(\d+)_(KB|AB)_L(\d+)_(\d+)\.mp3$/;
  const match = filename.match(regex);
  
  if (!match) return {};
  
  const [_, moduleId, bookType, lessonStr, partStr] = match;
  const lessonNumber = parseInt(lessonStr);
  const partNumber = parseInt(partStr);
  
  return {
    moduleId,
    bookType,
    lessonNumber,
    partNumber,
    displayName: `Lesson ${lessonNumber} - Part ${partNumber}${bookType === 'AB' ? ' (Workbook)' : ''}`
  };
}

function scanAudioFiles() {
  const audioDir = path.join(__dirname, '../public/assets/audio');
  const tracks = [];
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
    return tracks;
  }

  const moduleDirs = fs.readdirSync(audioDir);
  
  for (const dirName of moduleDirs) {
    const dirParts = dirName.split('_');
    const moduleId = dirParts[0];
    const moduleNumber = dirParts.length > 1 ? dirParts[1] : '';
    const band = dirParts.length > 2 ? dirParts[2] : '';
    
    const moduleDir = path.join(audioDir, dirName);
    const files = fs.readdirSync(moduleDir);
    
    for (const file of files) {
      const parsed = parseAudioFilename(file);
      if (parsed.moduleId) {
        tracks.push({
          id: `${moduleId}-${parsed.bookType}-${parsed.lessonNumber}-${parsed.partNumber}`,
          moduleId,
          moduleNumber,
          band,
          bookType: parsed.bookType,
          lessonNumber: parsed.lessonNumber,
          partNumber: parsed.partNumber,
          filePath: `/assets/audio/${dirName}/${file}`,
          displayName: parsed.displayName
        });
      }
    }
  }
  
  return tracks;
}

// Generate and save audio metadata
const tracks = scanAudioFiles();
const outputDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'audio-metadata.json');
fs.writeFileSync(outputPath, JSON.stringify(tracks, null, 2));
console.log(`Generated audio metadata with ${tracks.length} tracks`);