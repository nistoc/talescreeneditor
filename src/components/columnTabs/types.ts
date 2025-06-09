export type VerticalPosition = 'top' | 'center' | 'bottom';
export type HorizontalPosition = 'left' | 'right';
export type CollapseDirection = 'left' | 'right';

export interface ColumnProps {
  // Collapse button settings
  collapseButtonPosition?: {
    vertical: VerticalPosition;
    horizontal: HorizontalPosition;
  };
  collapseDirection?: CollapseDirection;
  
  // Content sections
  buttons?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  
  // State and callbacks
  isCollapsed: boolean;
  onCollapseChange: (isCollapsed: boolean) => void;
  
  // Styling
  width: string;
  className?: string;
} 