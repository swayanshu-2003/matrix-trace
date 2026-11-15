import { defineConfig } from "tsup";
import * as fs from "fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  external: ["react", "react-dom"],
  onSuccess: async () => {
    const files = ["dist/index.js", "dist/index.mjs"];
    for (const file of files) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, "utf8");
        if (
          !content.startsWith('"use client"') &&
          !content.startsWith("'use client'")
        ) {
          fs.writeFileSync(file, `"use client";\n${content}`);
        }
      }
    }
  },
});
