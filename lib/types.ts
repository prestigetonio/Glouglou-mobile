export type WineType = 'Rouge' | 'Blanc' | 'Rosé' | 'Champagne' | 'Spiritueux' | 'Autre';

export interface Bottle {
  id: number;
  userId: string;
  name: string;
  domain: string;
  type: WineType;
  vintage: number | null;
  year: number;          // année d'achat (obligatoire côté API)
  region: string | null;
  country: string | null;
  quantity: number;
  price: number | null;
  rating: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BottleFormData {
  name: string;
  domain: string;
  type: WineType;
  vintage: string;       // millésime (récolte)
  year: string;          // année d'achat
  region: string;
  country: string;
  quantity: string;
  price: string;
  rating: number | null;
  notes: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'premium';
}

export type WineTypeConfig = {
  bg: string;
  text: string;
  icon: string;
};

export const WINE_TYPE_CONFIG: Record<WineType, WineTypeConfig> = {
  Rouge: { bg: '#F5DADA', text: '#7A1515', icon: '🍷' },
  Blanc: { bg: '#F5E9C8', text: '#6B4400', icon: '🥂' },
  Rosé: { bg: '#F7D6E8', text: '#9D1555', icon: '🌸' },
  Champagne: { bg: '#F2E4BA', text: '#7A5500', icon: '🍾' },
  Spiritueux: { bg: '#EDD9C8', text: '#5C2A0E', icon: '🥃' },
  Autre: { bg: '#E2E4E8', text: '#3D4149', icon: '🫙' },
};

export const WINE_TYPES: WineType[] = ['Rouge', 'Blanc', 'Rosé', 'Champagne', 'Spiritueux', 'Autre'];

export const FREE_LIMIT = 50;
