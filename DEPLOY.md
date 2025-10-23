# 🚀 Quick Deployment Guide

## Option 1: Client Only (Single Player)

Perfect for static hosting - no server needed!

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

1. Drag & drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Deploy to GitHub Pages

```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

---

## Option 2: Full Stack (Multiplayer)

Requires both client and server deployment.

### Quick Build

**Windows:**
```bash
build-all.bat
```

**Mac/Linux:**
```bash
chmod +x build-all.sh
./build-all.sh
```

This creates a `deploy/` folder with:
- `deploy/client/` - Frontend files
- `deploy/server/` - Backend files

### Deploy Server

#### Option A: Heroku

```bash
cd server
heroku create uno-game-server
git init
git add .
git commit -m "Deploy server"
heroku git:remote -a uno-game-server
git push heroku main
```

#### Option B: Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory to `server/`
5. Railway will auto-detect and deploy

#### Option C: Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

### Deploy Client

1. **Update Server URL** in `src/hooks/useSocket.ts`:
   ```typescript
   const SOCKET_URL = 'https://your-server-url.herokuapp.com';
   ```

2. **Rebuild**:
   ```bash
   npm run build
   ```

3. **Deploy** to Vercel/Netlify (see Option 1)

---

## Environment Variables

### Server (.env)

```env
PORT=3001
NODE_ENV=production
```

### Client (.env)

```env
VITE_SERVER_URL=https://your-server-url.com
```

---

## Testing Production Build

### Test Client

```bash
npm run preview
```

Visit http://localhost:4173

### Test Server

```bash
cd server
npm start
```

Server runs on http://localhost:3001

---

## Deployment Checklist

- [ ] Build client: `npm run build`
- [ ] Build server: `cd server && npm install`
- [ ] Deploy server first
- [ ] Get server URL
- [ ] Update `src/hooks/useSocket.ts` with server URL
- [ ] Rebuild client with new server URL
- [ ] Deploy client
- [ ] Test both single player and multiplayer modes

---

## Quick Deploy Commands

### Vercel (Client)
```bash
npm run build && vercel --prod
```

### Netlify (Client)
```bash
npm run build && netlify deploy --prod --dir=dist
```

### Heroku (Server)
```bash
cd server
git push heroku main
```

---

## Troubleshooting

### CORS Errors

Update `server/index.js`:
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: "https://your-client-url.com",
    methods: ["GET", "POST"]
  }
});
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Server Not Connecting

1. Check server is running
2. Verify server URL in client code
3. Check CORS settings
4. Ensure WebSocket support on hosting platform

---

## Production URLs

After deployment, you'll have:

- **Client**: https://your-app.vercel.app
- **Server**: https://your-server.herokuapp.com
- **Game**: Access via client URL

Share the client URL with friends to play multiplayer! 🎮
