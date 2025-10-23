import React, { useState, useEffect } from 'react';
import { Card as CardType, Player, CardColor, GameDirection } from './types';
import { createDeck, canPlayCard, getNextPlayerIndex, getBotMove } from './utils/gameLogic';
import Card from './components/Card';
import ColorPicker from './components/ColorPicker';
import GameModeSelector from './components/GameModeSelector';
import MultiplayerLobby from './components/MultiplayerLobby';
import { useSocket } from './hooks/useSocket';
import './App.css';

const App: React.FC = () => {
  const { socket, connected } = useSocket();
  const [gameMode, setGameMode] = useState<'menu' | 'single' | 'multi' | 'playing'>('menu');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [deck, setDeck] = useState<CardType[]>([]);
  const [discardPile, setDiscardPile] = useState<CardType[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [direction, setDirection] = useState<GameDirection>(1);
  const [currentColor, setCurrentColor] = useState<CardColor>('red');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<CardType | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [message, setMessage] = useState('');

  const initGame = (multiplayerPlayers?: any[]) => {
    const newDeck = createDeck();
    let initialPlayers: Player[];

    if (multiplayerPlayers && multiplayerPlayers.length > 0) {
      initialPlayers = multiplayerPlayers.map((p) => ({
        id: p.id,
        name: p.name,
        cards: [],
        isBot: false
      }));
    } else {
      initialPlayers = [
        { id: '1', name: 'You', cards: [], isBot: false },
        { id: '2', name: 'Bot 1', cards: [], isBot: true },
        { id: '3', name: 'Bot 2', cards: [], isBot: true },
        { id: '4', name: 'Bot 3', cards: [], isBot: true },
      ];
    }

    let deckCopy = [...newDeck];
    initialPlayers.forEach(player => {
      player.cards = deckCopy.splice(0, 7);
    });

    let firstCard = deckCopy.shift()!;
    while (firstCard.color === 'wild') {
      deckCopy.push(firstCard);
      firstCard = deckCopy.shift()!;
    }

    setDeck(deckCopy);
    setDiscardPile([firstCard]);
    setPlayers(initialPlayers);
    setCurrentColor(firstCard.color);
    setCurrentPlayerIndex(0);
    setDirection(1);
    setGameStarted(true);
    setWinner(null);
    setMessage('');
    setGameMode('playing');
  };

  useEffect(() => {
    if (gameStarted && players.length > 0) {
      const currentPlayer = players[currentPlayerIndex];
      
      if (currentPlayer.cards.length === 0) {
        setWinner(currentPlayer);
        setMessage(`${currentPlayer.name} wins!`);
        return;
      }

      if (currentPlayer.isBot && !isMultiplayer) {
        setTimeout(() => {
          playBotTurn();
        }, 1000);
      }
    }
  }, [currentPlayerIndex, gameStarted]);

  useEffect(() => {
    if (!socket || !isMultiplayer) return;

    socket.on('gameUpdate', (action: any) => {
      if (action.type === 'playCard') {
        handleRemoteCardPlay(action);
      } else if (action.type === 'drawCard') {
        handleRemoteDrawCard(action);
      }
    });

    socket.on('playerLeft', () => {
      setMessage('A player left the game');
    });

    return () => {
      socket.off('gameUpdate');
      socket.off('playerLeft');
    };
  }, [socket, isMultiplayer, players, discardPile]);

  const playBotTurn = () => {
    const currentPlayer = players[currentPlayerIndex];
    const topCard = discardPile[discardPile.length - 1];
    const playableIndex = getBotMove(currentPlayer.cards, topCard, currentColor);

    if (playableIndex !== -1) {
      const cardToPlay = currentPlayer.cards[playableIndex];
      playCard(cardToPlay, playableIndex);
    } else {
      drawCard(currentPlayerIndex);
    }
  };

  const playCard = (card: CardType, cardIndex: number) => {
    const currentPlayer = players[currentPlayerIndex];
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex].cards = currentPlayer.cards.filter((_, i) => i !== cardIndex);

    setPlayers(newPlayers);
    setDiscardPile([...discardPile, card]);

    if (isMultiplayer && socket) {
      socket.emit('gameAction', {
        roomId,
        action: {
          type: 'playCard',
          playerId: currentPlayer.id,
          card,
          cardIndex
        }
      });
    }

    if (card.color === 'wild') {
      if (currentPlayer.isBot) {
        const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrentColor(randomColor);
        handleCardEffect(card);
      } else {
        setPendingWildCard(card);
        setShowColorPicker(true);
        return;
      }
    } else {
      setCurrentColor(card.color);
      handleCardEffect(card);
    }
  };

  const handleRemoteCardPlay = (action: any) => {
    const playerIndex = players.findIndex(p => p.id === action.playerId);
    if (playerIndex === -1) return;

    const newPlayers = [...players];
    newPlayers[playerIndex].cards = newPlayers[playerIndex].cards.filter((_, i) => i !== action.cardIndex);
    setPlayers(newPlayers);
    setDiscardPile([...discardPile, action.card]);
    
    if (action.card.color !== 'wild') {
      setCurrentColor(action.card.color);
    }
  };

  const handleRemoteDrawCard = (action: any) => {
    const playerIndex = players.findIndex(p => p.id === action.playerId);
    if (playerIndex === -1) return;
    drawCardsForPlayer(playerIndex, 1);
  };

  const handleCardEffect = (card: CardType) => {
    let skipNext = false;
    let drawCount = 0;

    switch (card.value) {
      case 'skip':
        skipNext = true;
        setMessage(`${players[currentPlayerIndex].name} skipped the next player!`);
        break;
      case 'reverse':
        setDirection(direction === 1 ? -1 : 1);
        setMessage(`${players[currentPlayerIndex].name} reversed the direction!`);
        break;
      case 'draw2':
        drawCount = 2;
        setMessage(`${players[currentPlayerIndex].name} made the next player draw 2 cards!`);
        break;
      case 'wild4':
        drawCount = 4;
        setMessage(`${players[currentPlayerIndex].name} made the next player draw 4 cards!`);
        break;
      default:
        setMessage('');
    }

    let nextIndex = getNextPlayerIndex(currentPlayerIndex, players.length, direction);

    if (drawCount > 0) {
      drawCardsForPlayer(nextIndex, drawCount);
      skipNext = true;
    }

    if (skipNext) {
      nextIndex = getNextPlayerIndex(nextIndex, players.length, direction);
    }

    setTimeout(() => {
      setCurrentPlayerIndex(nextIndex);
    }, 300);
  };

  const drawCardsForPlayer = (playerIndex: number, count: number) => {
    const newPlayers = [...players];
    const newDeck = [...deck];
    
    for (let i = 0; i < count; i++) {
      if (newDeck.length === 0) {
        const [topCard, ...rest] = discardPile;
        setDiscardPile([topCard]);
        newDeck.push(...rest);
      }
      const drawnCard = newDeck.shift();
      if (drawnCard) {
        newPlayers[playerIndex].cards.push(drawnCard);
      }
    }

    setPlayers(newPlayers);
    setDeck(newDeck);
  };

  const drawCard = (playerIndex: number) => {
    if (isMultiplayer && socket && playerIndex === 0) {
      socket.emit('gameAction', {
        roomId,
        action: {
          type: 'drawCard',
          playerId: players[playerIndex].id
        }
      });
    }

    drawCardsForPlayer(playerIndex, 1);
    const nextIndex = getNextPlayerIndex(playerIndex, players.length, direction);
    setTimeout(() => {
      setCurrentPlayerIndex(nextIndex);
    }, 300);
  };

  const handleColorSelect = (color: CardColor) => {
    setCurrentColor(color);
    setShowColorPicker(false);
    if (pendingWildCard) {
      handleCardEffect(pendingWildCard);
      setPendingWildCard(null);
    }
  };

  const handleCardClick = (card: CardType, cardIndex: number) => {
    if (currentPlayerIndex !== 0 || winner) return;
    
    const topCard = discardPile[discardPile.length - 1];
    if (canPlayCard(card, topCard, currentColor)) {
      playCard(card, cardIndex);
    }
  };

  const handleModeSelect = (mode: 'single' | 'multi') => {
    if (mode === 'single') {
      setIsMultiplayer(false);
      setGameMode('single');
      initGame();
    } else {
      setIsMultiplayer(true);
      setGameMode('multi');
    }
  };

  const handleMultiplayerStart = (lobbyPlayers: any[], newRoomId: string) => {
    setRoomId(newRoomId);
    initGame(lobbyPlayers);
  };

  if (gameMode === 'menu') {
    return (
      <div className="app">
        <GameModeSelector onSelectMode={handleModeSelect} />
      </div>
    );
  }

  if (gameMode === 'multi' && !gameStarted) {
    if (!connected) {
      return (
        <div className="app">
          <div className="start-screen">
            <h2>Connecting to server...</h2>
          </div>
        </div>
      );
    }
    return (
      <div className="app">
        <MultiplayerLobby
          socket={socket!}
          onStartGame={handleMultiplayerStart}
          onBack={() => setGameMode('menu')}
        />
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1>🎮 UNO Game</h1>
          <button className="start-button" onClick={() => initGame(undefined)}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const topCard = discardPile[discardPile.length - 1];
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="app">
      {showColorPicker && <ColorPicker onColorSelect={handleColorSelect} />}
      
      {winner && (
        <div className="winner-overlay">
          <div className="winner-message">
            <h2>🎉 {winner.name} Wins! 🎉</h2>
            <button className="restart-button" onClick={() => initGame(undefined)}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="game-header">
        <h1>UNO Game {isMultiplayer && `- Room: ${roomId}`}</h1>
        <div className="game-info">
          <span className="current-player">Current: {currentPlayer.name}</span>
          <span className="direction">Direction: {direction === 1 ? '→' : '←'}</span>
          <span className="deck-count">Deck: {deck.length}</span>
        </div>
      </div>

      {message && <div className="game-message">{message}</div>}

      <div className="opponents">
        {players.slice(1).map((player) => {
          const playerIndex = players.findIndex(p => p.id === player.id);
          return (
            <div key={player.id} className="opponent">
              <div className="opponent-name">
                {player.name} ({player.cards.length})
                {currentPlayerIndex === playerIndex && <span className="active-indicator">●</span>}
              </div>
              <div className="opponent-cards">
                {isMultiplayer ? (
                  player.cards.map((card, i) => (
                    <Card key={i} card={card} isPlayable={false} isSmall={true} />
                  ))
                ) : (
                  player.cards.map((_, i) => (
                    <div key={i} className="card-back small">UNO</div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="game-center">
        <div className="deck-area" onClick={() => currentPlayerIndex === 0 && !winner && drawCard(0)}>
          <div className="card-back">
            <div>DRAW</div>
            <div style={{ fontSize: '1rem' }}>{deck.length}</div>
          </div>
        </div>
        
        <div className="discard-pile">
          <Card card={topCard} isPlayable={false} />
          <div className="current-color" style={{ 
            background: currentColor === 'wild' ? 'linear-gradient(135deg, #ff6b6b, #4facfe, #43e97b, #ffd93d)' : currentColor 
          }}>
            {currentColor.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="player-hand">
        <div className="player-name">Your Hand</div>
        <div className="cards">
          {players[0].cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card, index)}
              isPlayable={currentPlayerIndex === 0 && !winner && canPlayCard(card, topCard, currentColor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
