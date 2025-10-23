import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (playerName) => {
    const roomId = Math.random().toString(36).substring(7).toUpperCase();
    rooms.set(roomId, {
      id: roomId,
      players: [{ id: socket.id, name: playerName, socketId: socket.id }],
      host: socket.id,
      gameState: null,
      started: false
    });
    socket.join(roomId);
    socket.emit('roomCreated', { roomId, playerId: socket.id });
    console.log(`Room ${roomId} created by ${playerName}`);
  });

  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    if (room.started) {
      socket.emit('error', 'Game already started');
      return;
    }
    if (room.players.length >= 4) {
      socket.emit('error', 'Room is full');
      return;
    }

    room.players.push({ id: socket.id, name: playerName, socketId: socket.id });
    socket.join(roomId);
    socket.emit('roomJoined', { roomId, playerId: socket.id });
    io.to(roomId).emit('playersUpdate', room.players);
    console.log(`${playerName} joined room ${roomId}`);
  });

  socket.on('startGame', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (!room || room.host !== socket.id) return;
    
    room.started = true;
    room.gameState = gameState;
    io.to(roomId).emit('gameStarted', gameState);
    console.log(`Game started in room ${roomId}`);
  });

  socket.on('gameAction', ({ roomId, action }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    
    socket.to(roomId).emit('gameUpdate', action);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted`);
        } else {
          if (room.host === socket.id) {
            room.host = room.players[0].socketId;
          }
          io.to(roomId).emit('playersUpdate', room.players);
          io.to(roomId).emit('playerLeft', socket.id);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
