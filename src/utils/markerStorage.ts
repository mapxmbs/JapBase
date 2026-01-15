import { MarkerColor } from '@/components/dashboard/RowMarker';

const STORAGE_KEY = 'japbase-row-markers';

export interface StoredMarkers {
  [sku: string]: MarkerColor;
}

export function getStoredMarkers(): StoredMarkers {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveMarker(sku: string, color: MarkerColor): void {
  if (typeof window === 'undefined') return;
  
  try {
    const markers = getStoredMarkers();
    if (color === null) {
      delete markers[sku];
    } else {
      markers[sku] = color;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
  } catch (error) {
    console.error('Erro ao salvar marcador:', error);
  }
}

export function getAllMarkers(): StoredMarkers {
  return getStoredMarkers();
}

export function clearAllMarkers(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
