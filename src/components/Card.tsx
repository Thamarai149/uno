import React from 'react';
import { Card as CardType } from '../types';
import './Card.css';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isPlayable?: boolean;
  isSmall?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, isPlayable = true, isSmall = false }) => {
  const getCardSymbol = () => {
    switch (card.value) {
      case 'skip': return '⊘';
      case 'reverse': return '⇄';
      case 'draw2': return '+2';
      case 'wild': return '🎨';
      case 'wild4': return '+4';
      default: return card.value;
    }
  };

  return (
    <div
      className={`card ${card.color} ${isPlayable ? 'playable' : 'not-playable'} ${isSmall ? 'small' : ''}`}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className="card-corner top-left">{getCardSymbol()}</div>
      <div className="card-center">
        <span>{getCardSymbol()}</span>
      </div>
      <div className="card-corner bottom-right">{getCardSymbol()}</div>
    </div>
  );
};

export default Card;
