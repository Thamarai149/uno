import React from 'react';
import './GameModeSelector.css';

interface GameModeSelectorProps {
  onSelectMode: (mode: 'single' | 'multi') => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="mode-selector">
      <h1>🎮 UNO Game</h1>
      <div className="mode-buttons">
        <button className="mode-button single" onClick={() => onSelectMode('single')}>
          <div className="mode-icon">🤖</div>
          <div className="mode-title">Single Player</div>
          <div className="mode-desc">Play against AI bots</div>
        </button>
        <button className="mode-button multi" onClick={() => onSelectMode('multi')}>
          <div className="mode-icon">👥</div>
          <div className="mode-title">Multiplayer</div>
          <div className="mode-desc">Play with friends online</div>
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;
