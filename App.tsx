import React from "react";
import MatrixTrace from "./MatrixTrace";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <MatrixTrace
        backgroundColor="#000000"
        fadedColor="#168f43"
        activeColor="#ffffff"
        glowColor="#00ff66"
        spacing={19}
        fontSize={13}
        emptySpace={0.18}
        randomness={0.42}
        trailRadius={60}
        fadeDuration={700}
        glowBlur={18}
        changeSpeed={1.2}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center pointer-events-none">
        <h1 className="text-5xl font-bold text-white">
          MatrixTrace
        </h1>
      </div>
    </section>
  );
}
