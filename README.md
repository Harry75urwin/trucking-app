# Trucking App

Full-stack trucking platform with a Vite + React frontend and NestJS + PostgreSQL backend.

## Project Structure

```
trucking/
├── package.json           # Root config with workspace scripts
├── packages/
│   ├── web/             # Vite + React frontend
│   └── backend/         # NestJS API backend
└── docker-compose.yml     # PostgreSQL database
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL (via Docker or local)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

Copy the example files and update values:

```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/web/.env.example packages/web/.env.development
```

Required environment variables are documented in the respective `.env.example` files.

## Development

### Start both apps

```bash
pnpm dev
```

### Start separately

```bash
# Backend (port 3000)
pnpm dev:backend

# Frontend (port 5173)
pnpm dev:web
```

## Production

```bash
# Build both
pnpm build

# Run backend
pnpm start
```

## API Documentation

Swagger UI is available at `http://localhost:3000/docs` when the backend is running.

## Demo Credentials

- Phone: `+91-9000000001`
- Password: `Demo@1234`

## Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/trucking-app.git
git push -u origin main
```