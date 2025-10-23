import { Card, CardColor, CardValue, GameDirection } from '../types';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  const numbers: CardValue[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const actions: CardValue[] = ['skip', 'reverse', 'draw2'];

  colors.forEach(color => {
    numbers.forEach(value => {
      deck.push({ id: `${color}-${value}-1`, color, value });
      if (value !== '0') {
        deck.push({ id: `${color}-${value}-2`, color, value });
      }
    });

    actions.forEach(value => {
      deck.push({ id: `${color}-${value}-1`, color, value });
      deck.push({ id: `${color}-${value}-2`, color, value });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `wild-${i}`, color: 'wild', value: 'wild' });
    deck.push({ id: `wild4-${i}`, color: 'wild', value: 'wild4' });
  }

  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const canPlayCard = (card: Card, topCard: Card, currentColor: CardColor): boolean => {
  if (card.color === 'wild') return true;
  if (card.color === currentColor) return true;
  if (card.value === topCard.value) return true;
  return false;
};

export const getNextPlayerIndex = (
  currentIndex: number,
  playerCount: number,
  direction: GameDirection
): number => {
  const nextIndex = currentIndex + direction;
  if (nextIndex >= playerCount) return 0;
  if (nextIndex < 0) return playerCount - 1;
  return nextIndex;
};

export const getBotMove = (botCards: Card[], topCard: Card, currentColor: CardColor): number => {
  const playableIndex = botCards.findIndex(card => canPlayCard(card, topCard, currentColor));
  return playableIndex;
};
