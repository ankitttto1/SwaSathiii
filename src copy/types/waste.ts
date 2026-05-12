export type WasteCategory = 'plastic' | 'organic' | 'metal' | 'ewaste' | 'paper' | 'glass' | 'unknown';

export interface WasteResult {
  category: WasteCategory;
  confidence: number;
  label: string;
  binColor: string;
  binLabel: string;
  description: string;
  tips: string[];
  recyclable: boolean;
  hazardous: boolean;
  icon: string;
}

export interface ScanRecord {
  id: string;
  user_id?: string;
  category: WasteCategory;
  confidence: number;
  image_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  total_scans: number;
  total_items_recycled: number;
  co2_saved: number;
  water_saved: number;
  created_at: string;
  updated_at: string;
}

export interface EcoImpact {
  user_id: string;
  total_scans: number;
  plastic_items: number;
  organic_items: number;
  metal_items: number;
  ewaste_items: number;
  paper_items: number;
  glass_items: number;
  co2_saved: number;
  water_saved: number;
  trees_saved: number;
  updated_at: string;
}
