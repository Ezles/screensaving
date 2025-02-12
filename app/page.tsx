"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ActionToolbar from "./components/ActionToolbar";
import Footer from "./components/Footer";
import ModeIndicator from "./components/ModeIndicator";
import NavigationBar from "./components/NavigationBar";
import SettingsPanel from "./components/SettingsPanel";
import { patterns } from "./screensaver/patterns";
import { initWebGL } from "./screensaver/webgl";

const DEFAULT_SETTINGS = {
  color: "transparent",
  speed: 50,
  density: 15000,
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState(0);
  const webGLRef = useRef<{
    changePattern: (index: number) => void;
    updateDensity: (density: number) => void;
  } | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(DEFAULT_SETTINGS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const glRef = useRef<WebGL2RenderingContext | null>(null);

  const applySettings = useCallback(() => {
    if (!glRef.current || !webGLRef.current) return;

    const gl = glRef.current;
    const program = gl.getParameter(gl.CURRENT_PROGRAM);
    if (!program) return;

    const speedLocation = gl.getUniformLocation(program, "u_speed");
    if (speedLocation) {
      gl.uniform1f(speedLocation, currentSettings.speed / 50.0);
    }

    const densityLocation = gl.getUniformLocation(program, "u_density");
    if (densityLocation) {
      gl.uniform1f(densityLocation, currentSettings.density / 15000.0);
    }

    const colorLocation = gl.getUniformLocation(program, "u_color");
    if (colorLocation) {
      if (currentSettings.color === "transparent") {
        gl.uniform3f(colorLocation, -1.0, -1.0, -1.0);
      } else {
        const r = parseInt(currentSettings.color.substr(1, 2), 16) / 255;
        const g = parseInt(currentSettings.color.substr(3, 2), 16) / 255;
        const b = parseInt(currentSettings.color.substr(5, 2), 16) / 255;
        gl.uniform3f(colorLocation, r, g, b);
      }
    }

    webGLRef.current.updateDensity(currentSettings.density);
  }, [currentSettings]);

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
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;

      const dpr = window.devicePixelRatio;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const gl = canvas.getContext("webgl2");
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      depth: true,
    });

    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    glRef.current = gl;
    webGLRef.current = initWebGL(gl, currentPattern);

    applySettings();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [currentPattern, applySettings]);

  useEffect(() => {
    applySettings();
  }, [currentSettings, applySettings]);

  const handlePatternChange = (index: number) => {
    setCurrentPattern(index);
    if (webGLRef.current) {
      webGLRef.current.changePattern(index);
    }
  };

  const handleControlChange = (
    id: string,
    value: number | string | boolean
  ) => {
    setCurrentSettings((prev) => {
      const newSettings = { ...prev, [id]: value };
      return newSettings;
    });
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

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-black"
      style={{ height: "100dvh" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full bg-black object-cover"
        style={{
          touchAction: "none",
          imageRendering: "pixelated",
        }}
      />

      <div
        className={`relative z-10 w-full h-full transition-opacity duration-500 safe-area-inset-bottom ${
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
          <h1 className="text-4xl sm:text-6xl font-bold text-white text-center mb-4 px-4">
            Screensaver Pro
          </h1>
          <p className="text-lg sm:text-xl text-white/80 text-center max-w-md px-4 mb-6">
            Une collection de motifs visuels interactifs
          </p>

          <ActionToolbar
            onFullscreen={handleFullscreen}
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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-transparent" />
      </div>
      <Footer isFocusMode={isFocusMode} />
    </main>
  );
}
