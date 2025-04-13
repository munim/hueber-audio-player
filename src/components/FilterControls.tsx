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

export default function FilterControls() {
  const { filters, updateFilters } = useContext(AudioContext);
  
  const availableModules = ['6001083', '6001084'];
  
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
          {availableModules.map((module) => (
            <SelectItem key={module} value={module}>
              Module {module}
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