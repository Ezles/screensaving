"use client";

import { FiDownload, FiMaximize2 } from "react-icons/fi";

interface ActionToolbarProps {
  onFullscreen: () => void;
  onDownload: () => void;
}

export default function ActionToolbar({
  onFullscreen,
  onDownload,
}: ActionToolbarProps) {
  return (
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5">
      <button
        onClick={onFullscreen}
        className="text-white/80 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-full"
      >
        <FiMaximize2 size={20} />
      </button>
      <div className="w-px h-5 bg-white/10" />
      <button
        onClick={onDownload}
        className="text-white/80 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-full"
      >
        <FiDownload size={20} />
      </button>
    </div>
  );
}
