const path = require('path');
const fs = require('fs');

// Supported book types and their display names
const BOOK_TYPES = {
  KB: 'Course Book',
  AB: 'Workbook'
  // Add more book types here as needed
};

function parseAudioFilename(filename) {
  const regex = /^(\d+)_([A-Z]{2})_L(\d+)_(\d+)\.mp3$/;
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
    displayName: `Lesson ${lessonNumber} - Part ${partNumber}${BOOK_TYPES[bookType] ? ` (${BOOK_TYPES[bookType]})` : ''}`
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
    
    // Look for book type subdirectories
    const bookTypeDirs = fs.readdirSync(moduleDir).filter(dir =>
      Object.keys(BOOK_TYPES).includes(dir)
    );
    
    for (const bookType of bookTypeDirs) {
      const bookTypeDir = path.join(moduleDir, bookType);
      const files = fs.readdirSync(bookTypeDir);
      
      for (const file of files) {
        const parsed = parseAudioFilename(file);
        if (parsed.moduleId) {
          tracks.push({
            id: `${moduleId}-${bookType}-${parsed.lessonNumber}-${parsed.partNumber}`,
            moduleId,
            moduleNumber,
            band,
            bookType,
            lessonNumber: parsed.lessonNumber,
            partNumber: parsed.partNumber,
            filePath: `/assets/audio/${dirName}/${bookType}/${file}`,
            displayName: parsed.displayName
          });
        }
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