# Trucking App

Full-stack trucking platform with a Vite + React frontend, React Native mobile app (Expo bare workflow), and NestJS + PostgreSQL backend.

## Quick Start

Follow these steps to get the project running locally:

### 1. Install Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8 (install with `npm install -g pnpm`)
- **Docker** (for PostgreSQL and LocalStack)
- **Xcode** (for iOS development, optional)
- **Android Studio** (for Android development, optional)

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Infrastructure Services

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port 5433 (database: `truckapp`, user: `truckuser`, pass: `truckpass`)
- **LocalStack S3** on port 4566 (for file uploads)

**Note:** If you get a container name conflict error, run:
```bash
docker rm -f truck-app-postgres truck-app-localstack && docker compose up -d
```

### 4. Configure Environment

```bash
cp packages/backend/.env.example packages/backend/.env
```

The default values in `.env.example` work with LocalStack. No changes needed for local development.

### 5. Start Development Servers

```bash
pnpm dev
```

This starts both frontend (port 5173) and backend (port 3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both frontend and backend |
| `pnpm dev:web` | Start frontend only (port 5173) |
| `pnpm dev:backend` | Start backend only (port 3000) |
| `pnpm dev:mobile` | Start mobile Metro bundler (port 8081) |
| `pnpm run:ios` | Run iOS simulator |
| `pnpm run:android` | Run Android emulator |
| `pnpm build` | Build both apps for production |
| `pnpm start` | Run backend in production mode |
| `pnpm lint` | Lint web and backend code |
| `pnpm format` | Format all code |
| `pnpm test` | Run backend tests |

## Project Structure

```
trucking/
├── package.json           # Root config with workspace scripts
├── packages/
│   ├── web/               # Vite + React frontend
│   ├── backend/           # NestJS API backend
│   └── mobile/            # React Native mobile app (bare workflow)
└── docker-compose.yml       # PostgreSQL and LocalStack services
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5433 | Database (credentials in `.env.example`) |
| LocalStack S3 | 4566 | S3-compatible storage for file uploads |
| Backend API | 3000 | NestJS REST API |
| Frontend | 5173 | Vite + React dev server |
| Mobile Metro Bundler | 8081 | React Native bundler (for mobile dev) |

## Mobile App

The mobile app uses Expo bare workflow. To run:

```bash
# Start Metro bundler
pnpm dev:mobile

# Run iOS simulator (requires Xcode)
pnpm run:ios

# Run Android emulator (requires Android Studio)
pnpm run:android
```

## API Documentation

Swagger UI is available at `http://localhost:3000/docs` when the backend is running.

## File Uploads

Files are stored in LocalStack S3 and accessible at:
- Local: `http://localhost:4566/truck-app-bucket/<path>`

## Demo Credentials

- Phone: `+91-9000000001`
- Password: `Demo@1234`

With `DEMO_DATA_ENABLED=true`, the following demo records are seeded:
- 3 customers
- 4 drivers
- 4 vehicles
- 5 loads
- 2 load assignments
- 1 dispatch record
- 2 tracking events
- 1 organization

## Viewing the Database

```bash
psql -h localhost -p 5433 -U truckuser -d truckapp
```

Or use any PostgreSQL client (pgAdmin, TablePlus, DBeaver) with:
- Host: `localhost`
- Port: `5433`
- Database: `truckapp`
- Username: `truckuser`
- Password: `truckpass`