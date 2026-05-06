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
  category: WasteCategory;
  confidence: number;
  image_url?: string;
  created_at: string;
}
