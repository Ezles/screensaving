'use client';

import { useEffect, useRef, useState } from 'react';
import { initWebGL } from './screensaver/webgl';
import { patterns } from './screensaver/patterns';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPattern, setCurrentPattern] = useState(0);
  const changePatternRef = useRef<((index: number) => void) | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    changePatternRef.current = initWebGL(gl, currentPattern);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handlePatternChange = (index: number) => {
    setCurrentPattern(index);
    if (changePatternRef.current) {
      changePatternRef.current(index);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-black"
      />
      
      {/* Pattern Selector Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full 
                 hover:bg-black/40 transition-all duration-300 font-medium"
      >
        {isMenuOpen ? 'Fermer' : 'Changer de Pattern'}
      </button>

      {/* Pattern Menu */}
      <div className={`absolute right-4 top-16 z-20 transition-all duration-300 transform 
                    ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 w-64">
          <h2 className="text-white font-bold mb-4 text-lg">Patterns</h2>
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <button
                key={pattern.name}
                onClick={() => handlePatternChange(index)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300
                         ${currentPattern === index 
                           ? 'bg-white/20 text-white' 
                           : 'text-white/70 hover:bg-white/10'}`}
              >
                {pattern.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-6xl font-bold text-white text-center mb-4 animate-pulse">
          Screensaver Pro
        </h1>
        <p className="text-xl text-white/80 text-center max-w-md px-4">
          {patterns[currentPattern].name}
        </p>
      </div>
    </main>
  );
}
