"use client";

import { useEffect, useRef, useState } from "react";
import ActionToolbar from "./components/ActionToolbar";
import ModeIndicator from "./components/ModeIndicator";
import NavigationBar from "./components/NavigationBar";
import SettingsPanel from "./components/SettingsPanel";
import { patterns } from "./screensaver/patterns";
import { initWebGL } from "./screensaver/webgl";

const DEFAULT_SETTINGS = {
  color: "#ffffff",
  speed: 50,
  density: 15000,
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState(0);
  const changePatternRef = useRef<((index: number) => void) | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(DEFAULT_SETTINGS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseMove = () => {
      setIsFocusMode(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsFocusMode(true);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    handleMouseMove();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
  }, [currentPattern]);

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

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Erreur lors du changement de mode plein écran:", err);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `screensaver-${patterns[currentPattern].name}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-black"
      />

      <div
        className={`relative z-10 w-full h-full transition-opacity duration-500 ${
          isFocusMode ? "opacity-0" : "opacity-100"
        }`}
      >
        <ModeIndicator currentMode={patterns[currentPattern].name} />

        <NavigationBar
          patterns={patterns}
          currentPattern={currentPattern}
          onPatternChange={handlePatternChange}
        />

        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-6xl font-bold text-white text-center mb-4">
            Screensaver Pro
          </h1>
          <p className="text-xl text-white/80 text-center max-w-md px-4 mb-6">
            Une collection de motifs visuels interactifs
          </p>

          <ActionToolbar
            onFullscreen={handleFullscreen}
            onDownload={handleDownload}
            isFullscreen={isFullscreen}
          />
        </div>

        <SettingsPanel
          isOpen={isControlsOpen}
          onToggle={() => setIsControlsOpen(!isControlsOpen)}
          onControlChange={handleControlChange}
          settings={currentSettings}
        />
      </div>
    </main>
  );
}
