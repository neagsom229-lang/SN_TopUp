import React from 'react';

interface GameCoverProps {
  slug: string;
  name: string;
  category?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function GameCover({
  slug,
  name,
  className = 'w-full h-full object-cover rounded-xl',
  width,
  height,
}: GameCoverProps) {
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palettes = [
    ['#10b981', '#065f46'],
    ['#06b6d4', '#0e7490'],
    ['#8b5cf6', '#5b21b6'],
    ['#f43f5e', '#be123c'],
    ['#f59e0b', '#b45309'],
    ['#3b82f6', '#1d4ed8'],
    ['#ec4899', '#9d174d'],
    ['#6366f1', '#3730a3'],
  ];
  const [color1, color2] = palettes[hash % palettes.length];

  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center text-white shadow-inner ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
        width: width || '100%',
        height: height || '100%',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl md:text-2xl font-black mb-2 shadow-lg tracking-wider text-white">
          {initials}
        </div>
        <span className="text-xs md:text-sm font-black tracking-tight line-clamp-1 px-1 text-white drop-shadow-md">
          {name}
        </span>
      </div>
    </div>
  );
}
