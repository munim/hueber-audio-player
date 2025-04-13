'use client';

import { useContext, useState, useEffect } from 'react';
import { AudioContext } from './AudioStateProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { AudioTrack } from '@/types';

export default function FilterControls() {
  const { filters, updateFilters } = useContext(AudioContext);
  const [moduleOptions, setModuleOptions] = useState<Array<{moduleId: string, band: string, moduleNumber: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data client-side only
    const audioMetadata = require('../../public/assets/audio-metadata.json');
    const options = Array.from(
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
    setModuleOptions(options);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex flex-col gap-4 sm:flex-row sm:items-center h-[56px]"></div>;
  }
  
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
          variant={filters.bookType === 'all' ? 'default' : 'outline'}
          onClick={() => updateFilters({ bookType: 'all' })}
        >
          All
        </Button>
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