declare module 'cytoscape-dagre' {
  import { Core } from 'cytoscape';
  function dagre(cytoscape: typeof Core): void;
  export default dagre;
} 