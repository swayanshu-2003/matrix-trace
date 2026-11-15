# matrix-trace

> An interactive, ultra-high-performance Matrix digital rain background component for **React**, featuring dynamic cursor wake, organic character clustering, and live character mutation.

---

### [**Live Demo**](https://matrix-trace.vercel.app)
> Tweak colors, trail radius, glyph mutation speeds, test light/dark modes, and copy ready-to-use component code in real time! - https://matrix-trace.vercel.app

---

## Preview

<div align="center">
  <a href="https://matrix-trace.vercel.app">
    <img src="https://www.image2url.com/r2/default/gifs/1794738109192-74c415fe-050a-4238-9e1c-6bcda8cd4564.gif" alt="Matrix Trace Demo Preview" width="100%" />
  </a>
</div>

<!-- 
TIP: Replace the placeholder image URL above with your actual GIF URL when ready:
e.g. "https://raw.githubusercontent.com/swayanshu-2003/matrix-trace/main/assets/demo.gif"
-->

---

## Installation

```bash
# npm
npm install matrix-trace

# pnpm
pnpm add matrix-trace

# yarn
yarn add matrix-trace

# bun
bun add matrix-trace
```

### Peer Dependencies
Requires **React 16.8+**, **React 18**, or **React 19**:
```bash
npm install react react-dom
```

---

## Quick Start

### Basic Usage

```tsx
import React from "react";
import MatrixTrace from "matrix-trace";

export default function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "#000" }}>
      {/* Interactive Matrix Background */}
      <MatrixTrace
        backgroundColor="#000000"
        fadedColor="#168f43"
        activeColor="#ffffff"
        glowColor="#00ff66"
        trailRadius={100}
        fadeDuration={1000}
      />

      {/* Foreground Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "4rem", color: "#fff" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Enter the Matrix</h1>
        <p>Move your mouse around to illuminate the code.</p>
      </div>
    </div>
  );
}
```

---

### Next.js (App Router)

`matrix-trace` has `"use client"` injected directly into its builds, so you can import it into client or page components without wrapper workarounds:

```tsx
// app/page.tsx
"use client";

import MatrixTrace from "matrix-trace";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
      <MatrixTrace
        backgroundColor="#050805"
        fadedColor="#0d5224"
        activeColor="#d1ffd6"
        glowColor="#00ff41"
        trailRadius={110}
      />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          System Operational
        </h1>
      </div>
    </main>
  );
}
```

---

### Named Imports & Aliases

The library provides convenient aliases depending on how you prefer to name the component in your codebase:

```tsx
// Default import
import MatrixTrace from "matrix-trace";

// Named import & aliases
import {
  MatrixTrace,
  MatrixCursorTrace,
  MatrixTrailBg,
  Glyphwake,
  DEFAULT_CHARACTERS
} from "matrix-trace";
```

---

## Props & Configuration

All props are optional and include carefully tuned defaults:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `backgroundColor` | `string` | `"#000000"` | Canvas background fill color. |
| `fadedColor` | `string` | `"#168f43"` | Color of static ambient background characters. |
| `activeColor` | `string` | `"#ffffff"` | Text color of active characters illuminated by the cursor. |
| `glowColor` | `string` | `"#00ff66"` | Glow shadow color for active cursor wake characters. |
| `glowBlur` | `number` | `18` | Shadow blur radius for the neon glow effect. |
| `trailRadius` | `number` | `115` | Radius (in pixels) of the interactive cursor wake area. |
| `fadeDuration` | `number` | `1100` | Fade-out duration for illuminated characters (in ms). |
| `changeSpeed` | `number` | `1` | Speed multiplier for in-place character mutation (higher = faster). |
| `spacing` | `number` | `19` | Grid spacing in pixels between characters. |
| `fontSize` | `number` | `13` | Font size in pixels. |
| `fontFamily` | `string` | `"monospace"` | CSS font family for rendering characters. |
| `fontWeight` | `number \| string` | `400` | Font weight (e.g. `400`, `600`, `"bold"`). |
| `characters` | `string[] \| string` | `DEFAULT_CHARACTERS` | Character pool, passed as an array or string. |
| `customCharacters` | `string` | `undefined` | Convenience string prop for custom glyph sets. |
| `emptySpace` | `number` | `0.18` | Cluster sparsity factor (`0` = dense, `1` = sparse). |
| `randomness` | `number` | `0.38` | Organic jitter and layout irregularity (`0` to `1`). |
| `minOpacity` | `number` | `0.06` | Minimum opacity for ambient background characters. |
| `maxOpacity` | `number` | `0.16` | Maximum opacity for ambient background characters. |
| `activeOpacity` | `number` | `1` | Peak opacity for cursor-activated characters. |
| `interactive` | `boolean` | `true` | When `false`, disables pointer tracking and wake effect. |
| `className` | `string` | `""` | Additional CSS class names for the outer container `div`. |
| `style` | `CSSProperties` | `undefined` | Inline styles for the outer container `div`. |

---

## Themes & Recipes

### 1. Classic The Matrix (Operator Console)

```tsx
<MatrixTrace
  backgroundColor="#030804"
  fadedColor="#116832"
  activeColor="#ffffff"
  glowColor="#00ff55"
  trailRadius={110}
  fadeDuration={1000}
  glowBlur={18}
/>
```

### 2. Cyberpunk Neon (Synthwave)

```tsx
<MatrixTrace
  backgroundColor="#0b001a"
  fadedColor="#4a154b"
  activeColor="#00ffff"
  glowColor="#ff007f"
  trailRadius={130}
  fadeDuration={1200}
  glowBlur={24}
  changeSpeed={1.5}
/>
```

### 3. Clean Light Mode (Modern Tech SaaS)

```tsx
<MatrixTrace
  backgroundColor="#ffffff"
  fadedColor="#94a3b8"
  activeColor="#0f172a"
  glowColor="#10b981"
  minOpacity={0.08}
  maxOpacity={0.22}
  trailRadius={100}
  fadeDuration={800}
  glowBlur={14}
/>
```

### 4. Deep Space Cyan

```tsx
<MatrixTrace
  backgroundColor="#020813"
  fadedColor="#0e3a5d"
  activeColor="#ffffff"
  glowColor="#00aaff"
  trailRadius={110}
  fadeDuration={1000}
  glowBlur={20}
/>
```

### 5. Binary Hacker

```tsx
<MatrixTrace
  characters="01"
  backgroundColor="#000000"
  fadedColor="#003311"
  activeColor="#00ff66"
  glowColor="#00aa33"
  fontSize={14}
  spacing={22}
  trailRadius={120}
/>
```

### 6. Authentic Katakana Matrix

```tsx
const JAPANESE_CHARACTERS = [
  ..."ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ",
  ..."0123456789",
  ..."Z:・.\"=*+-<>¦｜",
];

<MatrixTrace
  characters={JAPANESE_CHARACTERS}
  fontFamily="'Courier New', monospace"
  backgroundColor="#050805"
  fadedColor="#0d5224"
  activeColor="#ffffff"
  glowColor="#00ff41"
/>
```

---

## Practical Integration Tips

### 1. Relative Container Sizing
`MatrixTrace` internally expands to `100%` width and height of its parent using `position: absolute; inset: 0`.

Make sure its parent container specifies `position: relative`:

```tsx
<div style={{ position: "relative", width: "100%", height: "100vh" }}>
  <MatrixTrace />
  <div style={{ position: "relative", zIndex: 1 }}>
    {/* Foreground content remains interactable */}
  </div>
</div>
```

### 2. Foreground Element Clicks
Because the inner `<canvas>` has `pointer-events: none`, all clicks, text selections, and interactions on your buttons, links, and forms pass through directly without interference.

### 3. Dynamic Dark / Light Theme Toggle
Easily adapt to light/dark themes using state or a theme hook:

```tsx
<MatrixTrace
  backgroundColor={isDark ? "#090a0f" : "#ffffff"}
  fadedColor={isDark ? "#1e293b" : "#cbd5e1"}
  activeColor={isDark ? "#ffffff" : "#0f172a"}
  glowColor={isDark ? "#38bdf8" : "#2563eb"}
/>
```

---

## Performance Architecture

1. **Offscreen Ambient Canvas Buffer**: The static background characters are rendered once onto an offscreen canvas and cached. Ambient frames require zero geometry recalculation.
2. **Dynamic Trace Layer**: Only characters affected by the active pointer wake are updated during animation cycles, preserving battery and GPU resources.
3. **Automatic Cleanup & Resize Observer**: Canvas sizes dynamically adapt to window resizing or container DOM mutations with automatic debouncing and listener cleanup.

---

## License

MIT (c) [Swayanshu](https://github.com/swayanshu-2003)

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [GitHub repository](https://github.com/swayanshu-2003/matrix-trace).
