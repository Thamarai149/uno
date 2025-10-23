import React from 'react';
import { CardColor } from '../types';
import './ColorPicker.css';

interface ColorPickerProps {
  onColorSelect: (color: CardColor) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];

  return (
    <div className="color-picker-overlay">
      <div className="color-picker">
        <h3>Choose a Color</h3>
        <div className="color-options">
          {colors.map(color => (
            <button
              key={color}
              className={`color-button ${color}`}
              onClick={() => onColorSelect(color)}
            >
              {color.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
