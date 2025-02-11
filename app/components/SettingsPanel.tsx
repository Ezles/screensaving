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
    <div className="fixed bottom-16 right-4 z-50">
      <button
        onClick={onToggle}
        className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white/80 hover:text-white transition-all hover:bg-white/10"
        title="Paramètres"
      >
        <Settings size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-4 w-[calc(100vw-2rem)] sm:w-80 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">Paramètres</h3>
            <button
              onClick={handleReset}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Vitesse
                  </label>
                  <span className="text-white/60 text-sm">
                    {settings.speed}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.speed}
                  onChange={(e) =>
                    onControlChange("speed", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Densité
                  </label>
                  <span className="text-white/60 text-sm">
                    {settings.density.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={settings.density}
                  onChange={(e) =>
                    onControlChange("density", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white/80 text-sm font-medium">
                    Couleur
                  </label>
                  <span className="text-white/60 text-sm">
                    {settings.color === "transparent"
                      ? "Auto"
                      : settings.color.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onControlChange("color", "transparent")}
                    className={`flex-1 py-1 px-3 rounded-md text-sm transition-colors ${
                      settings.color === "transparent"
                        ? "bg-white/20 text-white"
                        : "bg-black/20 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Auto
                  </button>
                  <input
                    type="color"
                    value={
                      settings.color === "transparent"
                        ? "#ffffff"
                        : settings.color
                    }
                    onChange={(e) => onControlChange("color", e.target.value)}
                    className={`w-8 h-8 rounded-md cursor-pointer transition-opacity ${
                      settings.color === "transparent"
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
