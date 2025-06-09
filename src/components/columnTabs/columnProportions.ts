import { create } from 'zustand';

// Types
interface ColumnProportions {
  leftPercentage: number;
  centralPercentage: number;
  rightPercentage: number;
}

interface ColumnCollapseState {
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
}

// Constants
const STORAGE_KEY = 'editor-column-proportions';
const DEFAULT_COLUMN_PERCENTAGES: ColumnProportions = {
  leftPercentage: 15,
  centralPercentage: 50,
  rightPercentage: 35,
};

// Validation
const validateProportions = (proportions: ColumnProportions): boolean => {
  const sum = proportions.leftPercentage + proportions.centralPercentage + proportions.rightPercentage;
  return Math.abs(sum - 100) < 0.01; // Allow small floating point differences
};

// Proportions Store
interface ProportionsStore {
  proportions: ColumnProportions;
  setProportions: (proportions: ColumnProportions) => void;
}

const loadProportions = (): ColumnProportions => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return validateProportions(parsed) ? parsed : DEFAULT_COLUMN_PERCENTAGES;
    } catch {
      return DEFAULT_COLUMN_PERCENTAGES;
    }
  }
  return DEFAULT_COLUMN_PERCENTAGES;
};

export const useProportionsStore = create<ProportionsStore>((set) => ({
  proportions: loadProportions(),
  setProportions: (proportions: ColumnProportions) => {
    if (!validateProportions(proportions)) {
      console.warn('Invalid proportions: sum must be 100%');
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proportions));
    set({ proportions });
  },
}));

// Collapse Store
interface CollapseStore {
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
  toggleLeftCollapse: () => void;
  toggleRightCollapse: () => void;
}

export const useCollapseStore = create<CollapseStore>((set) => ({
  isLeftCollapsed: false,
  isRightCollapsed: false,
  toggleLeftCollapse: () => set((state) => ({ isLeftCollapsed: !state.isLeftCollapsed })),
  toggleRightCollapse: () => set((state) => ({ isRightCollapsed: !state.isRightCollapsed })),
}));

// Combined hook for convenience
export const useColumnProportions = () => {
  const proportions = useProportionsStore((state) => state.proportions);
  const setProportions = useProportionsStore((state) => state.setProportions);
  const { isLeftCollapsed, isRightCollapsed, toggleLeftCollapse, toggleRightCollapse } = useCollapseStore();

  const getEffectiveProportions = (): ColumnProportions => {
    if (!isLeftCollapsed && !isRightCollapsed) {
      return proportions;
    }
    
    return {
      leftPercentage: isLeftCollapsed ? 0 : proportions.leftPercentage,
      centralPercentage: isLeftCollapsed || isRightCollapsed 
        ? 100 - (isLeftCollapsed ? 0 : proportions.leftPercentage) - (isRightCollapsed ? 0 : proportions.rightPercentage) 
        : proportions.centralPercentage,
      rightPercentage: isRightCollapsed ? 0 : proportions.rightPercentage
    };
  };

  return {
    proportions,
    setProportions,
    isLeftCollapsed,
    isRightCollapsed,
    toggleLeftCollapse,
    toggleRightCollapse,
    getEffectiveProportions,
  };
}; 