<p align="center">
  <img src="packages/mobile/assets/icon.png" alt="Trucking App" width="120" />
</p>

<p align="center">
  <a href="https://github.com/nestjs/nest">
    <img src="https://img.shields.io/badge/NestJS-11.0.1-E0234E?logo=nestjs" alt="NestJS" />
  </a>
  <a href="https://github.com/facebook/react">
    <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react" alt="React" />
  </a>
  <a href="https://github.com/expo/expo">
    <img src="https://img.shields.io/badge/Expo-56.0.12-000020?logo=expo" alt="Expo" />
  </a>
  <a href="https://github.com/vitejs/vite">
    <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite" alt="Vite" />
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL" />
  </a>
  <a href="https://github.com/pnpm/pnpm">
    <img src="https://img.shields.io/badge/pnpm-8+-F69220?logo=pnpm" alt="pnpm" />
  </a>
</p>

<h1 align="center">Trucking Platform</h1>

<p align="center">
  Full-stack trucking platform with React dashboard, React Native mobile app, and NestJS API
</p>

---

## ✨ Features

- **Multi-role Dashboard**: Admin, Dispatcher, Fleet Manager, Driver, and Customer views
- **Real-time Messaging**: Instant communication via Socket.IO
- **Load Tracking**: GPS tracking and load status management
- **Fleet Management**: Vehicles, drivers, and dispatch coordination
- **File Uploads**: S3-compatible storage for documents and images
- **Mobile First**: Native mobile experience for on-the-go access

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8
- **Docker** (for PostgreSQL and LocalStack S3)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start infrastructure (PostgreSQL + LocalStack)
docker compose up -d

# 3. Configure environment
cp packages/backend/.env.example packages/backend/.env

# 4. Start development servers
pnpm dev
```

### Development URLs

| Service | URL |
|---------|-----|
| Frontend Dashboard | <http://localhost:5173> |
| Backend API | <http://localhost:3000> |
| Swagger Docs | <http://localhost:3000/docs> |
| Mobile Bundler | <http://localhost:8081> |

## 📱 Platform Screenshots

> Add screenshots of your dashboard and mobile app here

| Frontend Dashboard | Mobile App |
|------------------|------------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Mobile](docs/screenshots/mobile.png) |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vite, React 19, TypeScript, Tailwind CSS, Recharts |
| **Mobile** | React Native 0.85, Expo 56, React Navigation |
| **Backend** | NestJS 11, TypeORM, PostgreSQL, Socket.IO |
| **Storage** | LocalStack S3 (local) / AWS S3 |

## 📁 Project Structure

```
trucking/
├── packages/
│   ├── web/       # Vite + React dashboard
│   ├── backend/   # NestJS REST API
│   └── mobile/    # React Native app
├── docker-compose.yml
└── package.json
```

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm dev:web` | Frontend only |
| `pnpm dev:backend` | Backend only |
| `pnpm dev:mobile` | Mobile Metro bundler |
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests |

## 🔑 Demo Credentials

```
Phone:   +91-9000000001
Password: Demo@1234
```

Demo data includes: 3 customers, 4 drivers, 4 vehicles, 5 loads, and dispatch records.

## 📄 License

MIT License