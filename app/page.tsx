"use client";

import { useEffect, useRef, useState } from "react";
import { FiDownload, FiMaximize2, FiSettings } from "react-icons/fi";
import { patterns } from "./screensaver/patterns";
import { initWebGL } from "./screensaver/webgl";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState(0);
  const changePatternRef = useRef<((index: number) => void) | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<
    Record<string, number | string | boolean>
  >({});

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    changePatternRef.current = initWebGL(gl, currentPattern);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handlePatternChange = (index: number) => {
    setCurrentPattern(index);
    if (changePatternRef.current) {
      changePatternRef.current(index);
    }
  };

  const handleControlChange = (
    id: string,
    value: number | string | boolean
  ) => {
    setCurrentSettings((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-black"
      />

      <div className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur-md rounded-full px-4 py-2">
        <span className="text-white/80 font-medium">
          {patterns[currentPattern].name}
        </span>
      </div>

      <nav className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/30 backdrop-blur-md rounded-full px-2 py-1 flex gap-1">
          {patterns.map((pattern, index) => (
            <button
              key={pattern.name}
              onClick={() => handlePatternChange(index)}
              className={`px-4 py-2 rounded-full transition-all duration-300
                       ${
                         currentPattern === index
                           ? "bg-white/20 text-white"
                           : "text-white/70 hover:bg-white/10"
                       }`}
            >
              {pattern.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-6xl font-bold text-white text-center mb-4">
          Screensaver Pro
        </h1>
        <p className="text-xl text-white/80 text-center max-w-md px-4 mb-6">
          Une collection de motifs visuels interactifs
        </p>

        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5">
          <button className="text-white/80 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-full">
            <FiMaximize2 size={20} />
          </button>
          <div className="w-px h-5 bg-white/10" />
          <button className="text-white/80 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-full">
            <FiDownload size={20} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={() => setIsControlsOpen(!isControlsOpen)}
          className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white/80 hover:bg-white/10 transition-all"
        >
          <FiSettings size={20} />
        </button>

        <div
          className={`absolute bottom-full right-0 mb-2 transition-all duration-300 transform origin-bottom-right
                      ${
                        isControlsOpen
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0 pointer-events-none"
                      }`}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 w-80">
            <h3 className="text-white font-medium mb-4">Personnalisation</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/80 block">Couleur</label>
                <input
                  type="color"
                  className="w-full h-10 rounded bg-white/10"
                  onChange={(e) => handleControlChange("color", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/80 block">Vitesse</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full"
                    onChange={(e) =>
                      handleControlChange("speed", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 block">Densité</label>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    className="w-full"
                    onChange={(e) =>
                      handleControlChange("density", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
