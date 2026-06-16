# Trucking App

Full-stack trucking platform with a Vite + React frontend and NestJS + PostgreSQL backend.

## Project Structure

```
trucking/
├── package.json           # Root config with workspace scripts
├── packages/
│   ├── web/               # Vite + React frontend
│   └── backend/           # NestJS API backend
└── docker-compose.yml       # PostgreSQL and LocalStack services
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start services

```bash
docker compose up -d
```

This starts PostgreSQL (port 5433) and LocalStack S3 (port 4566).

### 3. Configure environment

Copy the example files:

```bash
cp packages/backend/.env.example packages/backend/.env
```

Environment variables are documented in `packages/backend/.env.example`. Default values work with LocalStack.

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

### Initialize S3 bucket

The backend automatically creates the S3 bucket on startup. If using LocalStack CLI:

```bash
awslocal s3 mb s3://truck-app-bucket
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

## File Uploads

The app uses LocalStack S3 for file uploads. Files are accessible at:
- Local: `http://localhost:4566/truck-app-bucket/<path>`

## Demo Credentials

- Phone: `+91-9000000001`
- Password: `Demo@1234`

## Services

| Service     | Port  | Description          |
|-------------|-------|----------------------|
| PostgreSQL  | 5433  | Database (mapped to 5432 in container) |
| LocalStack  | 4566  | S3-compatible storage |
| Backend API | 3000  | NestJS REST API      |
| Frontend    | 5173  | Vite + React dev server |