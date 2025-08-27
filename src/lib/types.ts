import { z } from 'zod';

export type DisposalAction = 'Recycle' | 'Landfill' | 'Compost' | 'Special Drop-off';

export interface Rule {
  action: DisposalAction;
  preparation: string;
  notes: string;
  source: string;
}

export const WasteItemSchema = z.enum(['PET Bottle', 'Paper Cup', 'Battery', 'Apple Core', 'Glass Bottle']);
export type WasteItem = z.infer<typeof WasteItemSchema>;


export type RecyclingRules = Record<WasteItem, Rule>;

export interface ScannedItem {
  id: string;
  name: WasteItem;
  imageUrl: string;
  rule: Rule;
  timestamp: number;
  weight?: number; // in kg
}
