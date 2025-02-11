"use client";

import { useRef, useState } from "react";
import {
  FiDownload,
  FiFile,
  FiImage,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";

interface ActionToolbarProps {
  onFullscreen: () => void;
  onDownloadPNG: () => void;
  isFullscreen: boolean;
}

export default function ActionToolbar({
  onFullscreen,
  onDownloadPNG,
  isFullscreen,
}: ActionToolbarProps) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
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
      <div className="relative">
        <button
          ref={downloadButtonRef}
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="text-white/80 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-full"
          title="Télécharger"
        >
          <FiDownload size={20} />
        </button>

        {showDownloadMenu && (
          <div className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-md rounded-lg py-1 min-w-[180px] shadow-lg">
            <button
              onClick={() => {
                onDownloadPNG();
                setShowDownloadMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                <FiImage size={18} />
              </div>
              Format PNG
            </button>
            <div className="group relative">
              <button
                disabled
                className="w-full text-left px-4 py-2 text-white/30 flex items-center gap-2 cursor-not-allowed"
              >
                <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                  <FiFile size={18} />
                </div>
                Format SCR
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/90 text-white/80 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Temporairement désactivé
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
