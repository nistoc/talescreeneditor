/**
 * Vertical position options for the collapse button
 */
export type VerticalPosition = 'top' | 'center' | 'bottom';

/**
 * Horizontal position options for the collapse button
 */
export type HorizontalPosition = 'left' | 'right';

/**
 * Direction in which the column can collapse
 */
export type CollapseDirection = 'left' | 'right';

/**
 * Position configuration for the collapse button
 */
export interface CollapseButtonPosition {
  vertical: VerticalPosition;
  horizontal: HorizontalPosition;
}

/**
 * Props for the Column component
 */
export interface ColumnProps {
  /** Configuration for the collapse button position */
  collapseButtonPosition?: CollapseButtonPosition;
  
  /** Direction in which the column collapses */
  collapseDirection?: CollapseDirection;
  
  /** Optional buttons to display in the header */
  buttons?: React.ReactNode;
  
  /** Title of the column */
  title?: string;
  
  /** Main content of the column */
  children: React.ReactNode;
  
  /** Whether the column is currently collapsed */
  isCollapsed: boolean;
  
  /** Callback when collapse state changes */
  onCollapseChange: (isCollapsed: boolean) => void;
  
  /** Width of the column (e.g. '100%', '200px') */
  width: string;
  
  /** Optional CSS class name */
  className?: string;
} 