import { LayoutOptions } from 'cytoscape';

export type DagreLayoutOptions = LayoutOptions & {
  rankDir?: 'TB' | 'BT' | 'LR' | 'RL';
  align?: 'UL' | 'UR' | 'DL' | 'DR';
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
  padding?: number;
  spacingFactor?: number;
} 