import React from "react";

interface SwatchSelectorProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

export const SwatchSelector: React.FC<SwatchSelectorProps> = ({
  colors,
  selectedColor,
  onSelect,
}) => {
  const colorMap: Record<string, string> = {
    "white": "#ffffff",
    "light blue": "#a8d5e5",
    "sky blue": "#a8d5e5",
    "pink": "#e8b0b0",
    "sunset pink": "#e8b0b0",
    "olive green": "#657053",
    "tan beige": "#d7c6b5",
    "desert sand": "#d7c6b5",
    "cocoa brown": "#5c4033",
    "navy blue": "#1d2a44",
    "carbon black": "#151515"
  };

  return (
    <div className="flex space-x-2 mt-3">
      {colors.map((color) => {
        const hex = colorMap[color.toLowerCase()] || color;
        const isWhite = color.toLowerCase() === "white";
        const isSelected = color === selectedColor;
        
        return (
          <button
            key={color}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(color);
            }}
            className={`w-6 h-6 rounded-full border transition-all duration-300 ${
              isSelected 
                ? 'border-gold scale-110 shadow-lg shadow-[#D4AF37]/35 ring-1 ring-gold/50' 
                : 'border-white/10 hover:border-white/40'
            }`}
            style={{ 
              backgroundColor: hex,
            }}
            title={color}
            aria-label={`Select color ${color}`}
          />
        );
      })}
    </div>
  );
};

export default SwatchSelector;
