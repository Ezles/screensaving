"use client";

import { Settings } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onControlChange: (id: string, value: number | string | boolean) => void;
  settings: {
    color: string;
    speed: number;
    density: number;
  };
}

export default function SettingsPanel({
  isOpen,
  onToggle,
  onControlChange,
  settings,
}: SettingsPanelProps) {
  const handleReset = () => {
    onControlChange("speed", 50);
    onControlChange("density", 15000);
    onControlChange("color", "transparent");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={onToggle}
        className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white/80 hover:text-white transition-all hover:bg-white/10"
        title="Paramètres"
      >
        <Settings size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-4 w-[calc(100vw-2rem)] sm:w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">Paramètres</h3>
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded-lg text-sm bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all"
            >
              Réinitialiser
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white/80 text-sm font-medium">Vitesse</label>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${settings.speed < 33 ? 'bg-blue-400' : settings.speed < 66 ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.speed}
                  onChange={(e) => onControlChange("speed", parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white/80 text-sm font-medium">Densité</label>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${settings.density < 10000 ? 'bg-blue-400' : settings.density < 20000 ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="30000"
                  step="1500"
                  value={settings.density}
                  onChange={(e) => onControlChange("density", parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white/80 text-sm font-medium">Couleur</label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="color"
                      value={settings.color === 'transparent' ? '#ffffff' : settings.color}
                      onChange={(e) => onControlChange("color", e.target.value)}
                      className="w-full h-10 rounded-lg border-2 border-white/10 cursor-pointer opacity-0 absolute inset-0"
                    />
                    <div 
                      className="w-full h-10 rounded-lg border-2 border-white/10 pointer-events-none"
                      style={{ 
                        backgroundColor: settings.color === 'transparent' ? 'transparent' : settings.color,
                        backgroundImage: settings.color === 'transparent' 
                          ? 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)'
                          : 'none',
                        backgroundSize: settings.color === 'transparent' ? '8px 8px' : undefined,
                        backgroundPosition: settings.color === 'transparent' ? '0 0, 4px 4px' : undefined
                      }}
                    />
                  </div>
                  <button
                    onClick={() => onControlChange("color", "transparent")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      settings.color === 'transparent'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                    } transition-all`}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
