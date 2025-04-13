import { FilterState } from '@/types';

export function getInitialStateFromURL(): FilterState {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return {
      moduleId: params.get('module') || '',
      bookType: (params.get('type') as 'KB' | 'AB') || 'KB',
      lessonNumber: parseInt(params.get('lesson') || '0') || null,
      partNumber: parseInt(params.get('part') || '0') || null,
    };
  }
  return { moduleId: '', bookType: 'KB', lessonNumber: null, partNumber: null };
}

export function updateURLParams(state: FilterState): void {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    
    if (state.moduleId) params.set('module', state.moduleId);
    if (state.bookType) params.set('type', state.bookType);
    if (state.lessonNumber) params.set('lesson', state.lessonNumber.toString());
    if (state.partNumber) params.set('part', state.partNumber.toString());
    
    window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
  }
}