export interface MapItem {
  id: string;
  name: string;
  type: 'landmark' | 'infrastructure' | 'nature' | 'entertainment' | 'transport';
  emoji: string;
  lat: number; // Latitude
  lng: number; // Longitude
  description?: string;
  size?: number; // scale factor, default 1
  population?: number; // Population impact
  taxRevenue?: number; // Tax revenue impact in JPY
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewMode = 'map' | 'blueprint';

export interface HighScore {
  id: string;
  name: string;
  score: number;
  date: string;
}