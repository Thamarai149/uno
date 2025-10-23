# UNO Game

A fully functional UNO card game built with React, TypeScript, and modern CSS. Play solo against AI or online with friends!

## Features

- 🎮 **Single Player Mode**: Play against 3 AI bots
- 👥 **Multiplayer Mode**: Play with friends online (2-4 players)
- 🎨 Beautiful gradient card designs
- ⚡ Smooth animations and transitions
- 🔄 All classic UNO rules (Skip, Reverse, Draw 2, Wild, Wild Draw 4)
- 📱 Responsive design for mobile and desktop
- 🎯 Interactive color picker for wild cards
- 🌐 Real-time multiplayer with WebSocket

## How to Play

### Single Player
1. Install dependencies: `npm install`
2. Start the game: `npm run dev`
3. Select "Single Player" mode
4. Play against AI bots

### Multiplayer

#### Quick Start (Windows)
1. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```
2. Run: `start-multiplayer.bat`
3. Both server and client will start automatically!

#### Quick Start (Mac/Linux)
1. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```
2. Make script executable: `chmod +x start-multiplayer.sh`
3. Run: `./start-multiplayer.sh`

#### Manual Start
1. Install dependencies for both client and server:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

2. Start the server (in one terminal):
   ```bash
   cd server
   npm start
   ```

3. Start the client (in another terminal):
   ```bash
   npm run dev
   ```

4. Select "Multiplayer" mode
5. Create a room or join with a room code
6. Share the room code with friends
7. Host starts the game when ready

## Game Rules

- Match cards by color or number
- Special cards:
  - **Skip**: Skip the next player's turn
  - **Reverse**: Reverse the direction of play
  - **Draw 2**: Next player draws 2 cards and loses their turn
  - **Wild**: Choose any color to continue
  - **Wild Draw 4**: Choose any color and next player draws 4 cards

## Tech Stack

- React 18
- TypeScript
- Vite
- Socket.IO (for multiplayer)
- Express (server)
- CSS3 with modern gradients and animations

## Project Structure

```
uno-game/
├── src/                    # Client source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Game logic utilities
│   └── types.ts           # TypeScript types
├── server/                # Multiplayer server
│   └── index.js          # Socket.IO server
└── package.json          # Client dependencies
```

## Multiplayer Features

- Create and join rooms with unique codes
- Real-time game synchronization
- Player lobby with ready status
- Host controls game start
- Automatic room cleanup on disconnect
- Support for 2-4 players per room
