import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ScannedItem } from '@/lib/types';

const AVERAGE_ITEM_WEIGHT_KG = 0.1; // 100g

interface FeedbackState {
    correct: number;
    incorrect: number;
}

interface RecyclingState {
  history: ScannedItem[];
  itemsSorted: number;
  wasteDiverted: number; // in kg, estimated
  feedback: FeedbackState,
  activeItem: ScannedItem | null;
  addToHistory: (item: ScannedItem) => void;
  updateWeight: (itemId: string, weightInKg: number) => void;
  recordCorrectIdentification: () => void;
  recordIncorrectIdentification: () => void;
  clearHistory: () => void;
  setActiveItem: (item: ScannedItem | null) => void;
}

const calculateWasteDiverted = (history: ScannedItem[]): number => {
    const total = history.reduce((acc, item) => {
        if (item.rule.action === 'Recycle' || item.rule.action === 'Compost') {
            return acc + (item.weight ?? AVERAGE_ITEM_WEIGHT_KG);
        }
        return acc;
    }, 0);
    return parseFloat(total.toFixed(2));
}

export const useRecyclingStore = create<RecyclingState>()(
  persist(
    (set, get) => ({
      history: [],
      itemsSorted: 0,
      wasteDiverted: 0,
      feedback: { correct: 0, incorrect: 0 },
      activeItem: null,
      addToHistory: (item) => {
        set((state) => {
            const newHistory = [item, ...state.history].slice(0, 50); // Keep last 50 items
            return {
                history: newHistory,
                itemsSorted: state.itemsSorted + 1,
                wasteDiverted: calculateWasteDiverted(newHistory),
            }
        });
      },
      updateWeight: (itemId, weightInKg) => {
        set((state) => {
            const newHistory = state.history.map((item) =>
                item.id === itemId ? { ...item, weight: weightInKg } : item
            );
            return {
                history: newHistory,
                wasteDiverted: calculateWasteDiverted(newHistory),
            }
        })
      },
      recordCorrectIdentification: () => {
        set((state) => ({
            feedback: {
                ...state.feedback,
                correct: state.feedback.correct + 1
            }
        }))
      },
      recordIncorrectIdentification: () => {
        set((state) => ({
            feedback: {
                ...state.feedback,
                incorrect: state.feedback.incorrect + 1
            }
        }))
      },
      clearHistory: () => set({ history: [], itemsSorted: 0, wasteDiverted: 0, feedback: { correct: 0, incorrect: 0 }, activeItem: null }),
      setActiveItem: (item) => set({ activeItem: item }),
    }),
    {
      name: 'recycling-wise-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
