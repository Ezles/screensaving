"use client";

import { useRef } from "react";
import {
  FiDownload,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";

interface ActionToolbarProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
}

export default function ActionToolbar({
  onFullscreen,
  isFullscreen,
}: ActionToolbarProps) {
  const downloadButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5">
      <button
        onClick={onFullscreen}
        className="text-white/80 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-full"
        title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
      >
        {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
      </button>
      <div className="w-px h-5 bg-white/10" />
      <div className="relative group">
        <button
          ref={downloadButtonRef}
          disabled
          className="text-white/30 p-1.5 rounded-full cursor-not-allowed"
          title="Téléchargement temporairement désactivé"
        >
          <FiDownload size={20} />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black/90 text-white/80 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Temporairement désactivé
        </span>
      </div>
    </div>
  );
}
