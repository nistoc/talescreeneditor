import { create } from 'zustand';

// Types
type Percentage = number;

interface ColumnProportions {
  leftPercentage: Percentage;
  centralPercentage: Percentage;
  rightPercentage: Percentage;
}

interface ColumnState {
  proportions: ColumnProportions;
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
}

interface ColumnActions {
  setProportions: (proportions: ColumnProportions) => void;
  toggleLeftCollapse: () => void;
  toggleRightCollapse: () => void;
  getEffectiveProportions: () => ColumnProportions;
}

type ColumnStore = ColumnState & ColumnActions;

// Constants
const STORAGE_KEY = 'editor-column-proportions';
const DEFAULT_COLUMN_PERCENTAGES: ColumnProportions = {
  leftPercentage: 15,
  centralPercentage: 50,
  rightPercentage: 35,
};

// Validation
const validateProportions = (proportions: ColumnProportions): boolean => {
  const { leftPercentage, centralPercentage, rightPercentage } = proportions;
  
  // Check if all percentages are non-negative
  if (leftPercentage < 0 || centralPercentage < 0 || rightPercentage < 0) {
    return false;
  }

  // Check if sum is approximately 100%
  const sum = leftPercentage + centralPercentage + rightPercentage;
  return Math.abs(sum - 100) < 0.01;
};

// Storage
const loadProportions = (): ColumnProportions => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_COLUMN_PERCENTAGES;

    const parsed = JSON.parse(stored);
    return validateProportions(parsed) ? parsed : DEFAULT_COLUMN_PERCENTAGES;
  } catch (error) {
    console.error('Failed to load column proportions:', error);
    return DEFAULT_COLUMN_PERCENTAGES;
  }
};

// Store
export const useColumnStore = create<ColumnStore>((set, get) => ({
  // State
  proportions: loadProportions(),
  isLeftCollapsed: false,
  isRightCollapsed: false,

  // Actions
  setProportions: (proportions: ColumnProportions) => {
    if (!validateProportions(proportions)) {
      console.warn('Invalid proportions: sum must be 100% and all values must be non-negative');
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proportions));
      set({ proportions });
    } catch (error) {
      console.error('Failed to save column proportions:', error);
    }
  },

  toggleLeftCollapse: () => set((state) => ({ 
    isLeftCollapsed: !state.isLeftCollapsed 
  })),

  toggleRightCollapse: () => set((state) => ({ 
    isRightCollapsed: !state.isRightCollapsed 
  })),

  getEffectiveProportions: () => {
    const { proportions, isLeftCollapsed, isRightCollapsed } = get();
    
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
  }
}));

// Convenience hook
export const useColumnProportions = () => {
  const store = useColumnStore();
  return {
    ...store,
    proportions: store.getEffectiveProportions()
  };
}; 