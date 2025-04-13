'use client';

import { useContext } from 'react';
import { AudioContext } from './AudioStateProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import audioMetadata from '../../public/assets/audio-metadata.json';
import type { AudioTrack } from '@/types';

export default function FilterControls() {
  const { filters, updateFilters } = useContext(AudioContext);
  
  // Get unique moduleId-band combinations
  const moduleOptions = Array.from(
    new Set(
      (audioMetadata as AudioTrack[]).map(item => `${item.moduleId}-${item.band}`)
    )
  ).map((moduleBand: string) => {
    const [moduleId, band] = moduleBand.split('-');
    const moduleData = (audioMetadata as AudioTrack[]).find(item => item.moduleId === moduleId);
    return {
      moduleId,
      band,
      moduleNumber: moduleData?.moduleNumber || ''
    };
  });
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Select
        value={filters.moduleId}
        onValueChange={(value) => updateFilters({ moduleId: value })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select Module" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modules</SelectItem>
          {moduleOptions.map(({moduleId, moduleNumber, band}) => (
            <SelectItem key={`${moduleId}-${band}`} value={moduleId}>
              Module {moduleNumber} - {band}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <Button 
          variant={filters.bookType === 'KB' ? 'default' : 'outline'}
          onClick={() => updateFilters({ bookType: 'KB' })}
        >
          Course Book
        </Button>
        <Button 
          variant={filters.bookType === 'AB' ? 'default' : 'outline'}
          onClick={() => updateFilters({ bookType: 'AB' })}
        >
          Workbook
        </Button>
      </div>
    </div>
  );
}