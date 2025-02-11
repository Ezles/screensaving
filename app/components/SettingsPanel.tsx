"use client";

import { FiSettings } from "react-icons/fi";

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onControlChange: (id: string, value: number | string | boolean) => void;
  settings: Record<string, number | string | boolean>;
}

export default function SettingsPanel({
  isOpen,
  onToggle,
  onControlChange,
  settings,
}: SettingsPanelProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20">
      <button
        onClick={onToggle}
        className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white/80 hover:bg-white/10 transition-all"
      >
        <FiSettings size={20} />
      </button>

      <div
        className={`absolute bottom-full right-0 mb-2 transition-all duration-300 transform origin-bottom-right
                  ${
                    isOpen
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
                value={settings.color as string}
                className="w-full h-10 rounded bg-white/10"
                onChange={(e) => onControlChange("color", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/80 block">Vitesse</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.speed as number}
                  className="w-full"
                  onChange={(e) =>
                    onControlChange("speed", parseFloat(e.target.value))
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
                  value={settings.density as number}
                  className="w-full"
                  onChange={(e) =>
                    onControlChange("density", parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
