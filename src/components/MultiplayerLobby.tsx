import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import './MultiplayerLobby.css';

interface Player {
  id: string;
  name: string;
  socketId: string;
}

interface MultiplayerLobbyProps {
  socket: Socket;
  onStartGame: (players: Player[], roomId: string) => void;
  onBack: () => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ socket, onStartGame, onBack }) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('roomCreated', ({ roomId }: { roomId: string }) => {
      setCurrentRoomId(roomId);
      setIsHost(true);
      setMode('create');
    });

    socket.on('roomJoined', ({ roomId }: { roomId: string }) => {
      setCurrentRoomId(roomId);
      setIsHost(false);
    });

    socket.on('playersUpdate', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    socket.on('gameStarted', () => {
      onStartGame(players, currentRoomId);
    });

    socket.on('error', (message: string) => {
      setError(message);
      setTimeout(() => setError(''), 3000);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('playersUpdate');
      socket.off('gameStarted');
      socket.off('error');
    };
  }, [socket, players, currentRoomId, isHost, onStartGame]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    socket.emit('createRoom', playerName);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      setError('Please enter your name and room ID');
      return;
    }
    socket.emit('joinRoom', { roomId: roomId.toUpperCase(), playerName });
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      setError('Need at least 2 players to start');
      return;
    }
    socket.emit('startGame', { roomId: currentRoomId, gameState: { players } });
  };

  if (mode === 'menu') {
    return (
      <div className="multiplayer-lobby">
        <h2>Multiplayer Mode</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="lobby-menu">
          <button className="lobby-button" onClick={() => setMode('create')}>
            Create Room
          </button>
          <button className="lobby-button" onClick={() => setMode('join')}>
            Join Room
          </button>
          <button className="lobby-button back" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'create' && !currentRoomId) {
    return (
      <div className="multiplayer-lobby">
        <h2>Create Room</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="lobby-input"
          maxLength={20}
        />
        <div className="lobby-actions">
          <button className="lobby-button" onClick={handleCreateRoom}>
            Create
          </button>
          <button className="lobby-button back" onClick={() => setMode('menu')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'join' && !currentRoomId) {
    return (
      <div className="multiplayer-lobby">
        <h2>Join Room</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="lobby-input"
          maxLength={20}
        />
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          className="lobby-input"
          maxLength={10}
        />
        <div className="lobby-actions">
          <button className="lobby-button" onClick={handleJoinRoom}>
            Join
          </button>
          <button className="lobby-button back" onClick={() => setMode('menu')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="multiplayer-lobby">
      <h2>Room: {currentRoomId}</h2>
      <div className="room-id-display">
        <span>Share this code with friends:</span>
        <div className="room-code">{currentRoomId}</div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="players-list">
        <h3>Players ({players.length}/4)</h3>
        {players.map((player, index) => (
          <div key={player.id} className="player-item">
            <span className="player-number">{index + 1}</span>
            <span className="player-name">{player.name}</span>
            {player.socketId === socket.id && <span className="you-badge">YOU</span>}
            {index === 0 && <span className="host-badge">HOST</span>}
          </div>
        ))}
      </div>
      <div className="lobby-actions">
        {isHost && (
          <button 
            className="lobby-button start" 
            onClick={handleStartGame}
            disabled={players.length < 2}
          >
            Start Game
          </button>
        )}
        {!isHost && (
          <div className="waiting-message">Waiting for host to start...</div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerLobby;
