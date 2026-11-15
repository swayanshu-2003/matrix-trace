import type { CSSProperties, HTMLAttributes } from "react";

export interface MatrixTraceProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Additional CSS class name for the wrapper element.
   * Default: `""`
   */
  className?: string;

  /**
   * Inline CSS styles for the wrapper element.
   */
  style?: CSSProperties;

  /**
   * Characters to be used in the matrix background and cursor trace.
   * Can be passed either as an array of characters (e.g. `["0", "1"]`)
   * or as a single string (e.g. `"0123456789ABCDEF$#@!"`).
   * Default: English uppercase, lowercase, numbers, and special symbols (`DEFAULT_CHARACTERS`).
   */
  characters?: string[] | string;

  /**
   * Custom characters provided directly as a string (e.g. `"0123456789ABCDEF$#@!"`).
   * Takes precedence when provided.
   */
  customCharacters?: string;

  /**
   * Font size in pixels for the matrix characters.
   * Default: `13`
   */
  fontSize?: number;

  /**
   * Font family for the matrix characters.
   * Default: `"monospace"`
   */
  fontFamily?: string;

  /**
   * Font weight for the matrix characters (e.g., `400`, `600`, `"bold"`).
   * Default: `400`
   */
  fontWeight?: number | string;

  /**
   * Grid spacing between characters in pixels.
   * Default: `19`
   */
  spacing?: number;

  /**
   * Proportion of empty space clusters (0 to 1). Higher values mean more sparse character distribution.
   * Default: `0.18`
   */
  emptySpace?: number;

  /**
   * Irregularity and jitter factor for character placement (0 to 1).
   * Default: `0.38`
   */
  randomness?: number;

  /**
   * Canvas background fill color.
   * Default: `"#000000"`
   */
  backgroundColor?: string;

  /**
   * Color of the static ambient characters in the background.
   * Default: `"#168f43"`
   */
  fadedColor?: string;

  /**
   * Base color of the active matrix cursor trace characters when cursor moves.
   * Default: `"#ffffff"`
   */
  activeColor?: string;

  /**
   * Glow blur color for active matrix cursor trace characters.
   * Default: `"#00ff66"`
   */
  glowColor?: string;

  /**
   * Minimum opacity for background static matrix characters.
   * Default: `0.06`
   */
  minOpacity?: number;

  /**
   * Maximum opacity for background static matrix characters.
   * Default: `0.16`
   */
  maxOpacity?: number;

  /**
   * Peak opacity for active matrix cursor trace characters.
   * Default: `1`
   */
  activeOpacity?: number;

  /**
   * Radius in pixels of the interactive matrix cursor trace.
   * Default: `115`
   */
  trailRadius?: number;

  /**
   * Duration in milliseconds for active trace characters to fade out completely.
   * Default: `1100`
   */
  fadeDuration?: number;

  /**
   * Canvas shadow blur radius for character glow effect.
   * Default: `18`
   */
  glowBlur?: number;

  /**
   * Speed multiplier for how frequently active matrix trace characters mutate and cycle.
   * Default: `1`
   */
  changeSpeed?: number;

  /**
   * Whether mouse and pointer movement illuminates characters with matrix cursor trace.
   * Default: `true`
   */
  interactive?: boolean;
}

/**
 * Modern named aliases for MatrixTraceProps.
 */
export type MatrixCursorTraceProps = MatrixTraceProps;
export type MatrixTrailBgProps = MatrixTraceProps;
export type GlyphwakeProps = MatrixTraceProps;
