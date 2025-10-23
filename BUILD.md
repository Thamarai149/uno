# Build & Deployment Guide

## 🚀 Quick Build

### Build for Production

```bash
npm run build
```

This will:
1. Run TypeScript compiler to check types
2. Build optimized production files
3. Output to `dist/` folder

### Preview Production Build

```bash
npm run preview
```

This starts a local server to preview the production build at http://localhost:4173

---

## 📦 Build Output

After running `npm run build`, you'll get:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
```

---

## 🌐 Deployment Options

### Option 1: Static Hosting (Vercel, Netlify, GitHub Pages)

**Single Player Only** (no server needed):

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to:
   - **Vercel**: `vercel --prod`
   - **Netlify**: Drag & drop `dist/` folder
   - **GitHub Pages**: Push `dist/` to `gh-pages` branch

### Option 2: Full Stack Deployment (with Multiplayer)

**Requires both client and server**:

#### Deploy Server (Backend):

1. Choose a hosting service:
   - Heroku
   - Railway
   - Render
   - DigitalOcean

2. Deploy `server/` folder with:
   ```bash
   cd server
   npm install
   npm start
   ```

3. Set environment variable:
   ```
   PORT=3001
   ```

4. Note your server URL (e.g., `https://your-server.herokuapp.com`)

#### Deploy Client (Frontend):

1. Update server URL in `src/hooks/useSocket.ts`:
   ```typescript
   const SOCKET_URL = 'https://your-server.herokuapp.com';
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

3. Deploy `dist/` folder to static hosting

---

## 🔧 Environment Configuration

### Development
- Client: http://localhost:3000
- Server: http://localhost:3001

### Production
Update these files before building:

**src/hooks/useSocket.ts**:
```typescript
const SOCKET_URL = process.env.VITE_SERVER_URL || 'http://localhost:3001';
```

**Create `.env` file**:
```
VITE_SERVER_URL=https://your-production-server.com
```

---

## 📋 Build Checklist

- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in `server/` directory
- [ ] Update server URL in `src/hooks/useSocket.ts`
- [ ] Run `npm run build` to create production build
- [ ] Test with `npm run preview`
- [ ] Deploy server first
- [ ] Update client with server URL
- [ ] Deploy client

---

## 🐛 Troubleshooting

### Build Errors

**TypeScript errors**:
```bash
npm run build -- --mode development
```

**Clear cache**:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Server Connection Issues

1. Check CORS settings in `server/index.js`
2. Verify server URL in `src/hooks/useSocket.ts`
3. Ensure server is running and accessible

---

## 📊 Build Optimization

The build is already optimized with:
- ✅ Code splitting
- ✅ Minification
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ Gzip compression

### Bundle Size

Typical production build:
- JavaScript: ~150-200 KB (gzipped)
- CSS: ~10-15 KB (gzipped)
- Total: ~160-215 KB

---

## 🚢 Docker Deployment (Optional)

### Dockerfile for Client

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile for Server

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
EXPOSE 3001
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  server:
    build:
      context: .
      dockerfile: Dockerfile.server
    ports:
      - "3001:3001"
  
  client:
    build:
      context: .
      dockerfile: Dockerfile.client
    ports:
      - "80:80"
    depends_on:
      - server
```

---

## 📱 Progressive Web App (PWA)

To make it installable, add to `index.html`:

```html
<link rel="manifest" href="/manifest.json">
```

Create `public/manifest.json`:
```json
{
  "name": "UNO Game",
  "short_name": "UNO",
  "description": "Play UNO online with friends",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
