<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
</p>

<h1 align="center">Trucking Backend API</h1>

<p align="center">
  NestJS REST API for the Trucking platform with PostgreSQL and S3 integration
</p>

---

## 📋 Overview

Backend API service for the Trucking platform providing:

- JWT-based authentication with multi-role support
- Real-time WebSocket messaging
- File upload via presigned S3 URLs
- Comprehensive API for fleet management

## 🔗 API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/auth/login` | POST | Authenticate user |
| `/auth/signup` | POST | Register new user |
| `/users` | GET, POST, PATCH, DELETE | User management |
| `/organizations` | GET, POST, PATCH, DELETE | Organization CRUD |
| `/drivers` | GET, POST, PATCH, DELETE | Driver profiles |
| `/vehicles` | GET, POST, PATCH, DELETE | Vehicle fleet |
| `/loads` | GET, POST, PATCH, DELETE | Load management |
| `/dispatches` | GET, POST, PATCH, DELETE | Dispatch records |
| `/tracking` | GET, POST, PATCH, DELETE | GPS tracking |
| `/messaging` | WebSocket | Real-time chat |
| `/upload` | POST, GET | File uploads |

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** 11.x | Backend framework |
| **TypeORM** 0.3 | Database ORM |
| **PostgreSQL** 16 | Primary database |
| **JWT** | Authentication |
| **Socket.IO** | Real-time messaging |
| **Swagger** | API documentation |

## ⚙️ Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 3000 | Server port |
| `DB_HOST` | localhost | Database host |
| `DB_PORT` | 5433 | Database port |
| `AUTH_SECRET` | - | JWT secret |
| `DEMO_DATA_ENABLED` | true | Seed demo data |

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start in watch mode
pnpm start:dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

## 📊 Demo Data

With `DEMO_DATA_ENABLED=true`:

- 3 customers
- 4 drivers
- 4 vehicles
- 5 loads
- 2 load assignments
- 1 dispatch record
- 2 tracking events

```
Phone:   +91-9000000001
Password: Demo@1234
```

## 🔌 API Documentation

Interactive Swagger UI available at `/docs` when server is running locally at `http://localhost:3000/docs`.

## 📄 License

MIT License