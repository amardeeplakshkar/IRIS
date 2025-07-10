declare module 'react-svg-to-image'
declare module 'react-mermaid2' {
  import { ComponentType, CSSProperties } from 'react';

  /**
   * Configuration options for Mermaid initialization
   */
  export interface MermaidConfig {
    theme?: 'default' | 'forest' | 'dark' | 'neutral' | 'null';
    themeVariables?: Record<string, string>;
    startOnLoad?: boolean;
    flowchart?: {
      useMaxWidth?: boolean;
      htmlLabels?: boolean;
      curve?: 'basis' | 'linear' | 'stepAfter';
    };
    sequence?: {
      diagramMarginX?: number;
      diagramMarginY?: number;
      actorMargin?: number;
      width?: number;
      height?: number;
      boxMargin?: number;
      boxTextMargin?: number;
      noteMargin?: number;
      messageMargin?: number;
      mirrorActors?: boolean;
      bottomMarginAdj?: number;
      useMaxWidth?: boolean;
      rightAngles?: boolean;
      showSequenceNumbers?: boolean;
    };
    gantt?: {
      useMaxWidth?: boolean;
      leftPadding?: number;
      gridLineStartPadding?: number;
      fontSize?: number;
      fontFamily?: string;
      sectionFontSize?: number;
      numberSectionStyles?: number;
    };
    journey?: {
      diagramMarginX?: number;
      diagramMarginY?: number;
      leftMargin?: number;
      width?: number;
      height?: number;
      boxMargin?: number;
      boxTextMargin?: number;
      noteMargin?: number;
      messageMargin?: number;
      bottomMarginAdj?: number;
      useMaxWidth?: boolean;
      rightAngles?: boolean;
    };
    class?: {
      useMaxWidth?: boolean;
    };
    git?: {
      useMaxWidth?: boolean;
    };
    state?: {
      useMaxWidth?: boolean;
    };
    pie?: {
      useMaxWidth?: boolean;
    };
    requirement?: {
      useMaxWidth?: boolean;
    };
    er?: {
      useMaxWidth?: boolean;
    };
    c4?: {
      useMaxWidth?: boolean;
    };
    mindmap?: {
      useMaxWidth?: boolean;
    };
    timeline?: {
      useMaxWidth?: boolean;
    };
    gitGraph?: {
      useMaxWidth?: boolean;
    };
    quadrantChart?: {
      useMaxWidth?: boolean;
    };
    xyChart?: {
      useMaxWidth?: boolean;
    };
    sankey?: {
      useMaxWidth?: boolean;
    };
    packet?: {
      useMaxWidth?: boolean;
    };
    block?: {
      useMaxWidth?: boolean;
    };
    architecture?: {
      useMaxWidth?: boolean;
    };
    logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox';
    maxTextSize?: number;
    maxEdges?: number;
    wrap?: boolean;
    fontSize?: number;
    useMaxWidth?: boolean;
    htmlLabels?: boolean;
    suppressErrorRendering?: boolean;
  }

  /**
   * Props for the Mermaid component
   */
  export interface MermaidProps {
    /**
     * The mermaid chart definition as a string
     */
    chart: string;
    
    /**
     * Configuration options for mermaid
     */
    config?: MermaidConfig;
    
    /**
     * CSS class name to apply to the container
     */
    className?: string;
    
    /**
     * Inline styles to apply to the container
     */
    style?: CSSProperties;
    
    /**
     * Width of the chart container
     */
    width?: string | number;
    
    /**
     * Height of the chart container
     */
    height?: string | number;
    
    /**
     * Callback function called when the chart is rendered successfully
     */
    onRender?: (id: string, svg: string) => void;
    
    /**
     * Callback function called when there's an error rendering the chart
     */
    onError?: (error: Error) => void;
    
    /**
     * Whether to suppress error rendering and show a fallback instead
     */
    suppressErrors?: boolean;
    
    /**
     * Custom error fallback component or string to display when rendering fails
     */
    errorFallback?: ComponentType<{ error: Error }> | string;
    
    /**
     * Loading component or string to display while rendering
     */
    loading?: ComponentType | string;
    
    /**
     * Whether the chart is currently being generated/updated
     */
    generating?: boolean;
    
    /**
     * Unique identifier for the chart (auto-generated if not provided)
     */
    id?: string;
  }

  /**
   * Main Mermaid React component for rendering mermaid diagrams
   */
  export const Mermaid: ComponentType<MermaidProps>;

  /**
   * Default export is the Mermaid component
   */
  const MermaidComponent: ComponentType<MermaidProps>;
  export default MermaidComponent;

  /**
   * Hook for accessing mermaid instance and utilities
   */
  export function useMermaid(): {
    /**
     * Initialize mermaid with custom config
     */
    initialize: (config: MermaidConfig) => void;
    
    /**
     * Render mermaid code to SVG
     */
    render: (id: string, code: string) => Promise<{ svg: string; bindFunctions?: (element: Element) => void }>;
    
    /**
     * Parse mermaid code for syntax validation
     */
    parse: (code: string) => Promise<boolean>;
    
    /**
     * Get current mermaid configuration
     */
    getConfig: () => MermaidConfig;
  };

  /**
   * Utility function to convert SVG string to base64 data URL
   */
  export function svgToBase64(svg: string): string;

  /**
   * Utility function to download SVG as file
   */
  export function downloadSvg(svg: string, filename?: string): void;

  /**
   * Utility function to convert SVG to PNG
   */
  export function svgToPng(svg: string, options?: {
    scale?: number;
    quality?: number;
    backgroundColor?: string;
  }): Promise<string>;

  /**
   * Type definitions for common mermaid diagram types
   */
  export type DiagramType = 
    | 'flowchart'
    | 'sequence'
    | 'class'
    | 'state'
    | 'er'
    | 'journey'
    | 'gantt'
    | 'pie'
    | 'requirement'
    | 'gitgraph'
    | 'c4'
    | 'mindmap'
    | 'timeline'
    | 'quadrant'
    | 'xychart'
    | 'sankey'
    | 'packet'
    | 'block'
    | 'architecture';

  /**
   * Theme options for mermaid diagrams
   */
  export type MermaidTheme = 'default' | 'forest' | 'dark' | 'neutral' | 'null';

  /**
   * Error types that can occur during mermaid rendering
   */
  export class MermaidError extends Error {
    constructor(message: string, public code?: string);
  }

  export class MermaidParseError extends MermaidError {
    constructor(message: string, public line?: number, public column?: number);
  }

  export class MermaidRenderError extends MermaidError {
    constructor(message: string, public diagramType?: DiagramType);
  }
}