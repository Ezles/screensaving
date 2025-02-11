"use client";

interface Pattern {
  name: string;
}

interface NavigationBarProps {
  patterns: Pattern[];
  currentPattern: number;
  onPatternChange: (index: number) => void;
}

export default function NavigationBar({
  patterns,
  currentPattern,
  onPatternChange,
}: NavigationBarProps) {
  return (
    <nav className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-black/30 backdrop-blur-md rounded-full px-2 py-1 flex gap-1">
        {patterns.map((pattern, index) => (
          <button
            key={pattern.name}
            onClick={() => onPatternChange(index)}
            className={`px-4 py-2 rounded-full transition-all duration-300
                     ${
                       currentPattern === index
                         ? "bg-white/20 text-white"
                         : "text-white/70 hover:bg-white/10"
                     }`}
          >
            {pattern.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
