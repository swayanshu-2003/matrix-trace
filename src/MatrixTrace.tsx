import React, { useEffect, useRef } from "react";
import type { MatrixTraceProps } from "./types";

export const DEFAULT_CHARACTERS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
  ..."!@#$%^&*()_+-=[]{};:,.<>/?\\|~",
];

type BackgroundCell = {
  x: number;
  y: number;
  char: string;
  opacity: number;
};

type ActiveCell = {
  x: number;
  y: number;
  char: string;
  lastHit: number;
  strength: number;
  nextChange: number;
};

const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const randomCharacter = (characters: string[]): string =>
  characters[Math.floor(Math.random() * characters.length)];

/**
 * Resolves character list from either a string array, a single character string, or customCharacters prop.
 */
function resolveCharacters(
  characters?: string[] | string,
  customCharacters?: string
): string[] {
  if (customCharacters && typeof customCharacters === "string") {
    const chars = customCharacters.split("").filter((c) => c.trim().length > 0);
    if (chars.length > 0) return chars;
  }
  if (typeof characters === "string") {
    const chars = characters.split("").filter((c) => c.trim().length > 0);
    if (chars.length > 0) return chars;
  }
  if (Array.isArray(characters) && characters.length > 0) {
    return characters;
  }
  return DEFAULT_CHARACTERS;
}

// Smooth 2D value noise (bilinear + smoothstep), returns 0..1
function createNoiseField(
  width: number,
  height: number,
  featureSize: number
): (x: number, y: number) => number {
  const cols = Math.ceil(width / featureSize) + 3;
  const rows = Math.ceil(height / featureSize) + 3;
  const lattice = new Float32Array(cols * rows);
  for (let i = 0; i < lattice.length; i++) lattice[i] = Math.random();

  const smooth = (t: number) => t * t * (3 - 2 * t);
  const at = (c: number, r: number) =>
    lattice[clamp(r, 0, rows - 1) * cols + clamp(c, 0, cols - 1)];

  return (x, y) => {
    const gx = x / featureSize + 1;
    const gy = y / featureSize + 1;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const fx = smooth(gx - x0);
    const fy = smooth(gy - y0);

    const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx;
    const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  };
}

function createBackgroundCells(
  width: number,
  height: number,
  spacing: number,
  characters: string[],
  minOpacity: number,
  maxOpacity: number,
  emptySpace: number,
  randomness: number
): BackgroundCell[] {
  const empty = clamp(emptySpace, 0, 1);
  const rand = clamp(randomness, 0, 1);

  if (empty >= 1) return [];

  const cols = Math.ceil(width / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;
  const jitter = spacing * 0.2 * rand;

  // Patch size scales with spacing so the look is consistent at any density
  const noise = createNoiseField(width, height, spacing * 8);

  type Candidate = { x: number; y: number; score: number };
  const candidates: Candidate[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const gridX = col * spacing;
      const gridY = row * spacing;

      // Low score => more likely to be removed. Randomness mixes in
      // per-cell speckle on top of the smooth patches.
      const score =
        noise(gridX, gridY) * (1 - 0.5 * rand) + Math.random() * 0.5 * rand;

      candidates.push({
        x: gridX + (jitter > 0 ? randomBetween(-jitter, jitter) : 0),
        y: gridY + (jitter > 0 ? randomBetween(-jitter, jitter) : 0),
        score,
      });
    }
  }

  // Remove exactly `emptySpace` fraction of cells (lowest scores)
  let threshold = -Infinity;
  if (empty > 0) {
    const sorted = candidates.map((c) => c.score).sort((a, b) => a - b);
    threshold =
      sorted[Math.min(sorted.length - 1, Math.floor(empty * sorted.length))];
  }

  const cells: BackgroundCell[] = [];
  for (const c of candidates) {
    if (empty > 0 && c.score < threshold) continue;
    cells.push({
      x: c.x,
      y: c.y,
      char: randomCharacter(characters),
      opacity: randomBetween(minOpacity, maxOpacity),
    });
  }

  return cells;
}

export function MatrixTrace({
  className = "",
  style,
  characters = DEFAULT_CHARACTERS,
  customCharacters,

  fontSize = 13,
  fontFamily = "monospace",
  fontWeight = 400,
  spacing = 19,

  emptySpace = 0.18,
  randomness = 0.38,

  backgroundColor = "#000000",
  fadedColor = "#168f43",
  activeColor = "#ffffff",
  glowColor = "#00ff66",

  minOpacity = 0.06,
  maxOpacity = 0.16,
  activeOpacity = 1,

  trailRadius = 115,
  fadeDuration = 1100,
  glowBlur = 18,
  changeSpeed = 1,
  interactive = true,
  ...restProps
}: MatrixTraceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderBackgroundRef = useRef<() => void>(() => {});

  const currentProps = {
    characters,
    customCharacters,
    fontSize,
    fontFamily,
    fontWeight,
    spacing,
    emptySpace,
    randomness,
    backgroundColor,
    fadedColor,
    activeColor,
    glowColor,
    minOpacity,
    maxOpacity,
    activeOpacity,
    trailRadius,
    fadeDuration,
    glowBlur,
    changeSpeed,
    interactive,
  };
  const propsRef = useRef(currentProps);
  propsRef.current = currentProps;

  // Mount effect: Initializes canvas context, listeners, and animation loop once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });
    if (!ctx) return;

    // Separate offscreen canvas for rendering the static background
    const backgroundCanvas = document.createElement("canvas");
    const bgCtx = backgroundCanvas.getContext("2d");
    if (!bgCtx) return;

    const activeCells = new Map<string, ActiveCell>();

    let width = 0;
    let height = 0;
    let dpr = 1;

    let animationFrame = 0;
    let previousPointer: { x: number; y: number } | null = null;

    // ----------------------------------------
    // Static background rendering to offscreen canvas
    // ----------------------------------------
    const renderBackground = () => {
      if (width <= 0 || height <= 0) return;

      const p = propsRef.current;
      const safeCharacters = resolveCharacters(p.characters, p.customCharacters);
      const safeSpacing = Math.max(4, p.spacing);
      const font = `${p.fontWeight} ${p.fontSize}px ${p.fontFamily}`;

      const cells = createBackgroundCells(
        width,
        height,
        safeSpacing,
        safeCharacters,
        p.minOpacity,
        p.maxOpacity,
        p.emptySpace,
        p.randomness
      );

      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgCtx.clearRect(0, 0, width, height);

      bgCtx.fillStyle = p.backgroundColor;
      bgCtx.fillRect(0, 0, width, height);

      bgCtx.font = font;
      bgCtx.textAlign = "center";
      bgCtx.textBaseline = "middle";
      bgCtx.fillStyle = p.fadedColor;
      bgCtx.shadowBlur = 0;

      for (const cell of cells) {
        bgCtx.globalAlpha = cell.opacity;
        bgCtx.fillText(cell.char, cell.x, cell.y);
      }

      bgCtx.globalAlpha = 1;
    };

    renderBackgroundRef.current = renderBackground;

    // ----------------------------------------
    // Resize handling
    // ----------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (width <= 0 || height <= 0) return;

      dpr = Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
        2
      );

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      backgroundCanvas.width = Math.round(width * dpr);
      backgroundCanvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      renderBackground();
    };

    // ----------------------------------------
    // Add active trail cells around pointer
    // ----------------------------------------
    const addTrailStamp = (x: number, y: number, now: number) => {
      const p = propsRef.current;
      const radius = p.trailRadius;
      const safeSpacing = Math.max(4, p.spacing);
      const safeCharacters = resolveCharacters(p.characters, p.customCharacters);

      const minCol = Math.max(0, Math.floor((x - radius) / safeSpacing));
      const maxCol = Math.ceil((x + radius) / safeSpacing);
      const minRow = Math.max(0, Math.floor((y - radius) / safeSpacing));
      const maxRow = Math.ceil((y + radius) / safeSpacing);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const px = col * safeSpacing;
          const py = row * safeSpacing;

          const dx = px - x;
          const dy = py - y;
          const angle = Math.atan2(dy, dx);

          // Organic trail irregularity
          const irregularity =
            1 + 0.13 * Math.sin(angle * 3) + 0.09 * Math.cos(angle * 5);

          const effectiveRadius = radius * irregularity;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared > effectiveRadius * effectiveRadius) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared);
          const strength = Math.pow(1 - distance / effectiveRadius, 0.65);
          const key = `${col},${row}`;

          let cell = activeCells.get(key);
          if (!cell) {
            cell = {
              x: px,
              y: py,
              char: randomCharacter(safeCharacters),
              lastHit: now,
              strength,
              nextChange: now + randomBetween(50, 160),
            };
            activeCells.set(key, cell);
          } else {
            cell.lastHit = now;
            cell.strength = Math.max(cell.strength, strength);
          }
        }
      }
    };

    // ----------------------------------------
    // Smooth pointer movement
    // ----------------------------------------
    const handlePointerMove = (event: PointerEvent) => {
      const p = propsRef.current;
      if (!p.interactive) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > width || y > height) {
        previousPointer = null;
        return;
      }

      const now = performance.now();

      if (!previousPointer) {
        addTrailStamp(x, y, now);
        previousPointer = { x, y };
        return;
      }

      const dx = x - previousPointer.x;
      const dy = y - previousPointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Interpolate fast cursor movements to prevent gaps
      const safeSpacing = Math.max(4, p.spacing);
      const step = Math.max(7, safeSpacing * 0.45);
      const steps = Math.min(350, Math.ceil(distance / step));

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        addTrailStamp(
          previousPointer.x + dx * t,
          previousPointer.y + dy * t,
          now
        );
      }

      previousPointer = { x, y };
    };

    const handlePointerLeave = () => {
      previousPointer = null;
    };

    // ----------------------------------------
    // Animation loop (runs at native display refresh rate)
    // ----------------------------------------
    const draw = (now: number) => {
      const p = propsRef.current;
      if (width > 0 && height > 0) {
        ctx.drawImage(backgroundCanvas, 0, 0, width, height);

        if (activeCells.size > 0) {
          const font = `${p.fontWeight} ${p.fontSize}px ${p.fontFamily}`;
          const safeCharacters = resolveCharacters(p.characters, p.customCharacters);

          ctx.font = font;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = p.activeColor;
          ctx.shadowColor = p.glowColor;
          ctx.shadowBlur = p.glowBlur;

          const fadeDuration = p.fadeDuration;
          const activeOpacity = p.activeOpacity;
          const changeSpeed = p.changeSpeed;

          for (const [key, cell] of activeCells) {
            const age = now - cell.lastHit;

            if (age >= fadeDuration) {
              activeCells.delete(key);
              continue;
            }

            const fade = 1 - age / fadeDuration;
            const alpha = activeOpacity * cell.strength * fade * fade;

            if (alpha < 0.005) {
              activeCells.delete(key);
              continue;
            }

            // Change characters independently
            if (now >= cell.nextChange) {
              let next = randomCharacter(safeCharacters);
              if (safeCharacters.length > 1) {
                while (next === cell.char) {
                  next = randomCharacter(safeCharacters);
                }
              }
              cell.char = next;
              cell.nextChange =
                now + randomBetween(75, 160) / Math.max(0.1, changeSpeed);
            }

            ctx.globalAlpha = clamp(alpha, 0, 1);
            ctx.fillText(cell.char, cell.x, cell.y);
          }

          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    // ----------------------------------------
    // Observers and event listeners
    // ----------------------------------------
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);

    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      activeCells.clear();
    };
  }, []);

  // Smoothly update offscreen background canvas whenever static background props change
  useEffect(() => {
    renderBackgroundRef.current();
  }, [
    characters,
    customCharacters,
    fontSize,
    fontFamily,
    fontWeight,
    spacing,
    emptySpace,
    randomness,
    backgroundColor,
    fadedColor,
    minOpacity,
    maxOpacity,
  ]);

  return (
    <div
      className={`matrix-trace absolute inset-0 h-full w-full overflow-hidden ${className}`.trim()}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
      aria-hidden="true"
      {...restProps}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export const MatrixCursorTrace = MatrixTrace;
export const MatrixTrailBg = MatrixTrace;
export const Glyphwake = MatrixTrace;
export default MatrixTrace;
