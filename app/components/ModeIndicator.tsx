"use client";

interface ModeIndicatorProps {
  currentMode: string;
}

export default function ModeIndicator({ currentMode }: ModeIndicatorProps) {
  return (
    <div className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur-md rounded-full px-4 py-2">
      <span className="text-white/80 font-medium">{currentMode}</span>
    </div>
  );
}
