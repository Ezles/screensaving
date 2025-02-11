"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ActionToolbar from "./components/ActionToolbar";
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

    const speedLocation = gl.getUniformLocation(program, 'u_speed');
    if (speedLocation) {
      gl.uniform1f(speedLocation, currentSettings.speed / 50.0);
    }

    const densityLocation = gl.getUniformLocation(program, 'u_density');
    if (densityLocation) {
      gl.uniform1f(densityLocation, currentSettings.density / 15000.0);
    }

    const colorLocation = gl.getUniformLocation(program, 'u_color');
    if (colorLocation) {
      if (currentSettings.color === 'transparent') {
        gl.uniform3f(colorLocation, -1.0, -1.0, -1.0);
      } else {
        const r = parseInt(currentSettings.color.substr(1,2), 16) / 255;
        const g = parseInt(currentSettings.color.substr(3,2), 16) / 255;
        const b = parseInt(currentSettings.color.substr(5,2), 16) / 255;
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext('webgl2', {
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      depth: true
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

  const handleControlChange = (id: string, value: number | string | boolean) => {
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

  const formatFileName = (baseName: string, format: string) => {
    const date = new Date().toISOString().split('T')[0];
    const sanitizedName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `screensaver_${sanitizedName}_${date}.${format}`;
  };

  const handleDownload = async (format: 'png' | 'scr') => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const fileName = formatFileName(patterns[currentPattern].name, format);
  
    if (format === 'png') {
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
        if (gl) {
          gl.flush();
          gl.finish();
        }

        ctx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = fileName;
        link.href = tempCanvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erreur lors de la capture PNG:', error);
      }
    } else if (format === 'scr') {
      try {
        const gl = canvas.getContext('webgl2');
        if (!gl) return;

        gl.flush();
        gl.finish();

        const pixels = new Uint8Array(canvas.width * canvas.height * 4);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        
        const blob = new Blob([pixels], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Erreur lors de la création du SCR:', error);
      }
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
            onDownloadPNG={() => handleDownload('png')}
            onDownloadSCR={() => handleDownload('scr')}
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
