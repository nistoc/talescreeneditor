import { create } from 'zustand';

interface ColumnProportions {
  leftPercentage: number;
  centralPercentage: number;
  rightPercentage: number;
}

interface ColumnProportionsStore {
  proportions: ColumnProportions;
  setProportions: (proportions: ColumnProportions) => void;
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
  toggleLeftCollapse: () => void;
  toggleRightCollapse: () => void;
  getEffectiveProportions: () => ColumnProportions;
}

const STORAGE_KEY = 'editor-column-proportions';

// Default column widths in percentages (must sum up to 100%)
const DEFAULT_COLUMN_PERCENTAGES: ColumnProportions = {
  leftPercentage: 15,        // 15% of total width
  centralPercentage: 50,     // 50% of total width
  rightPercentage: 35,       // 35% of total width
};

const loadProportions = (): ColumnProportions => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_COLUMN_PERCENTAGES;
    }
  }
  return DEFAULT_COLUMN_PERCENTAGES;
};

export const useColumnProportions = create<ColumnProportionsStore>((set, get) => ({
  proportions: loadProportions(),
  setProportions: (proportions: ColumnProportions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proportions));
    set({ proportions });
  },
  isLeftCollapsed: false,
  isRightCollapsed: false,
  toggleLeftCollapse: () => set((state: ColumnProportionsStore) => ({ isLeftCollapsed: !state.isLeftCollapsed })),
  toggleRightCollapse: () => set((state: ColumnProportionsStore) => ({ isRightCollapsed: !state.isRightCollapsed })),
  getEffectiveProportions: () => {
    const state = get();
    const { proportions, isLeftCollapsed, isRightCollapsed } = state;
    
    // If no columns are collapsed, return original proportions
    if (!isLeftCollapsed && !isRightCollapsed) {
      return proportions;
    }
    
    return {
      leftPercentage: isLeftCollapsed ? 0 : proportions.leftPercentage,
      centralPercentage: isLeftCollapsed || isRightCollapsed ? 100 - (isLeftCollapsed ? 0 : proportions.leftPercentage) - (isRightCollapsed ? 0 : proportions.rightPercentage) : proportions.centralPercentage,
      rightPercentage: isRightCollapsed ? 0 : proportions.rightPercentage
    };
  }
})); 